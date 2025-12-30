import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
     try {
          await connectDB();
          const { username, email, password } = await req.json();

          if (!username || !email || !password) {
               return NextResponse.json(
                    { error: "Please provide all fields" },
                    { status: 400 }
               );
          }

          const existingUser = await User.findOne({ $or: [{ email }, { username }] });
          if (existingUser) {
               return NextResponse.json(
                    { error: "User already exists with that email or username" },
                    { status: 400 }
               );
          }

          const hashedPassword = await bcrypt.hash(password, 10);

          const newUser = await User.create({
               username,
               email,
               password: hashedPassword,
          });

          return NextResponse.json(
               { message: "User created successfully", userId: newUser._id },
               { status: 201 }
          );
     } catch (error: any) {
          return NextResponse.json({ error: error.message }, { status: 500 });
     }
}
