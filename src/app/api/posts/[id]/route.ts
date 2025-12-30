import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Post from "@/lib/models/Post";
import jwt from "jsonwebtoken";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
     try {
          await connectDB();
          const { id } = await params;

          const post = await Post.findById(id)
               .populate("user", "username image")
               .populate("comments.user", "username");

          if (!post) {
               return NextResponse.json({ error: "Post not found" }, { status: 404 });
          }

          return NextResponse.json({ post }, { status: 200 });
     } catch (error: any) {
          return NextResponse.json({ error: error.message }, { status: 500 });
     }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
     try {
          await connectDB();
          const { id } = await params;

          const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
          if (!token) {
               return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
          }

          const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
          const currentUserId = decoded.id;

          const post = await Post.findById(id);
          if (!post) {
               return NextResponse.json({ error: "Post not found" }, { status: 404 });
          }

          if (post.user.toString() !== currentUserId) {
               return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
          }

          await Post.findByIdAndDelete(id);

          return NextResponse.json({ message: "Post deleted" }, { status: 200 });
     } catch (error: any) {
          return NextResponse.json({ error: error.message }, { status: 500 });
     }
}
