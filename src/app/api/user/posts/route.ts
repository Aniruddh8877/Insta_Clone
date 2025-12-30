import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Post from "@/lib/models/Post";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
     try {
          await connectDB();
          const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

          if (!token) {
               return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
          }

          const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
          const userId = decoded.id;

          const posts = await Post.find({ user: userId }).sort({ createdAt: -1 });

          return NextResponse.json({ posts }, { status: 200 });
     } catch (error: any) {
          return NextResponse.json({ error: error.message }, { status: 500 });
     }
}
