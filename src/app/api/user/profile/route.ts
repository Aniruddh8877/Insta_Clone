import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import cloudinary from "@/lib/cloudinary";
import jwt from "jsonwebtoken";

// Configure Next.js to allow larger payloads explicitly if needed for other reasons,
// but invalid 'config' export should be removed for App Router.


export async function PUT(req: Request) {
     try {
          await connectDB();
          const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

          if (!token) {
               return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
          }

          const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
          const userId = decoded.id;

          const formData = await req.formData();
          const bio = formData.get("bio") as string;
          const imageFile = formData.get("image") as File | null;

          let imageUrl = "";

          if (imageFile && imageFile.size > 0) {
               const arrayBuffer = await imageFile.arrayBuffer();
               const buffer = Buffer.from(arrayBuffer);

               // Upload to Cloudinary
               const uploadResult: any = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                         { folder: "instagram-clone-avatars" },
                         (error, result) => {
                              if (error) reject(error);
                              else resolve(result);
                         }
                    ).end(buffer);
               });

               imageUrl = uploadResult.secure_url;
          }

          const updateData: any = {};
          if (bio) updateData.bio = bio;
          if (imageUrl) updateData.image = imageUrl;

          const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
               new: true,
          }).select("-password");

          return NextResponse.json(
               { message: "Profile updated", user: updatedUser },
               { status: 200 }
          );
     } catch (error: any) {
          console.error("Profile update error:", error);
          return NextResponse.json({ error: error.message }, { status: 500 });
     }
}
