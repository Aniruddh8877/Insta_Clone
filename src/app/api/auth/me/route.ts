import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";

export async function GET(req: NextRequest) {
     try {
          await connectDB();
          const token = req.cookies.get("token")?.value;

          if (!token) {
               return NextResponse.json(
                    { error: "Not authenticated" },
                    { status: 401 }
               );
          }

          if (!process.env.JWT_SECRET) {
               throw new Error("JWT_SECRET is not defined in environment variables");
          }

          const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

          // Ideally fetch fresh data from DB to ensure user still exists
          const user = await User.findById(decoded.id).select("-password");

          if (!user) {
               return NextResponse.json(
                    { error: "User not found" },
                    { status: 404 }
               );
          }

          return NextResponse.json({ user }, { status: 200 });
     } catch (error: any) {
          return NextResponse.json({ error: "Invalid token" }, { status: 401 });
     }
}
