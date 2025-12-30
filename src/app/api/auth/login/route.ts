import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
     try {
          await connectDB();
          const { email, password } = await req.json();

          if (!email || !password) {
               return NextResponse.json(
                    { error: "Please provide email and password" },
                    { status: 400 }
               );
          }

          const user = await User.findOne({ email });
          if (!user) {
               return NextResponse.json(
                    { error: "Invalid credentials" },
                    { status: 401 }
               );
          }

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
               return NextResponse.json(
                    { error: "Invalid credentials" },
                    { status: 401 }
               );
          }

          if (!process.env.JWT_SECRET) {
               throw new Error("JWT_SECRET is not defined in environment variables");
          }

          const token = jwt.sign(
               { id: user._id, username: user.username, email: user.email },
               process.env.JWT_SECRET,
               { expiresIn: "1d" }
          );

          const response = NextResponse.json(
               { message: "Login successful", user: { id: user._id, username: user.username, email: user.email } },
               { status: 200 }
          );

          response.cookies.set("token", token, {
               httpOnly: true,
               path: "/",
               maxAge: 60 * 60 * 24, // 1 day
          });

          return response;
     } catch (error: any) {
          return NextResponse.json({ error: error.message }, { status: 500 });
     }
}
