import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Post from "@/lib/models/Post";
import jwt from "jsonwebtoken";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
     try {
          await connectDB();
          const { id } = await params;
          const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

          if (!token) {
               return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
          }

          const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
          const userId = decoded.id;

          const { text } = await req.json();
          if (!text) {
               return NextResponse.json({ error: "Comment text required" }, { status: 400 });
          }

          const post = await Post.findById(id);
          if (!post) {
               return NextResponse.json({ error: "Post not found" }, { status: 404 });
          }

          post.comments.push({
               user: userId,
               text,
          });

          await post.save();

          // Re-fetch to populate the user who just commented (optional but good for UI)
          const updatedPost = await Post.findById(id).populate("comments.user", "username");

          return NextResponse.json({ message: "Comment added", comments: updatedPost.comments }, { status: 200 });
     } catch (error: any) {
          return NextResponse.json({ error: error.message }, { status: 500 });
     }
}
