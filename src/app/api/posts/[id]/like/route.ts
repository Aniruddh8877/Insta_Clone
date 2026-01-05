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

          const post = await Post.findById(id);
          if (!post) {
               return NextResponse.json({ error: "Post not found" }, { status: 404 });
          }

          const isLiked = post.likes.includes(userId);

          if (isLiked) {
               post.likes = post.likes.filter((likeId: any) => likeId.toString() !== userId);
          } else {
               post.likes.push(userId);
          }

          await post.save();

          // Notify Socket Server
          try {
               await fetch("https://insta-clone-server-lkww.onrender.com/api/socket/update", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                         type: "post:liked",
                         postId: id,
                         data: { likes: post.likes }
                    })
               });
          } catch (error) {
               console.error("Socket notification failed:", error);
          }

          return NextResponse.json({ message: "Success", likes: post.likes }, { status: 200 });
     } catch (error: any) {
          return NextResponse.json({ error: error.message }, { status: 500 });
     }
}
