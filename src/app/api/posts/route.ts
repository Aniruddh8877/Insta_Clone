import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Post from "@/lib/models/Post";
import User from "@/lib/models/User";
import cloudinary from "@/lib/cloudinary";
import jwt from "jsonwebtoken";

export async function GET() {
     try {
          await connectDB();
          const posts = await Post.find()
               .populate("user", "username image")
               .populate("comments.user", "username")
               .sort({ createdAt: -1 });

          return NextResponse.json({ posts }, { status: 200 });
     } catch (error: any) {
          return NextResponse.json({ error: error.message }, { status: 500 });
     }
}

export async function POST(req: Request) {
     try {
          await connectDB();
          const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

          if (!token) {
               return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
          }

          const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
          const userId = decoded.id;

          const formData = await req.formData();
          const caption = formData.get("caption") as string;
          const files = formData.getAll("files") as File[];

          if (!files || files.length === 0) {
               return NextResponse.json({ error: "Media is required" }, { status: 400 });
          }

          const mediaItems = [];

          for (const file of files) {
               const arrayBuffer = await file.arrayBuffer();
               const buffer = Buffer.from(arrayBuffer);

               const isVideo = file.type.startsWith("video/");
               const resourceType = isVideo ? "video" : "image";

               const uploadResult: any = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                         {
                              folder: "instagram-clone-posts",
                              resource_type: resourceType
                         },
                         (error, result) => {
                              if (error) reject(error);
                              else resolve(result);
                         }
                    ).end(buffer);
               });

               mediaItems.push({
                    url: uploadResult.secure_url,
                    type: resourceType
               });
          }

          const newPost = await Post.create({
               user: userId,
               caption,
               image: mediaItems[0].url, // Fallback for old clients
               media: mediaItems,
          });

          return NextResponse.json({ message: "Post created", post: newPost }, { status: 201 });
     } catch (error: any) {
          return NextResponse.json({ error: error.message }, { status: 500 });
     }
}
