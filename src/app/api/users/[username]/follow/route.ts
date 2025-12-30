import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken";

export async function POST(req: Request, { params }: { params: Promise<{ username: string }> }) {
     try {
          await connectDB();
          // The route is /api/users/[username]/follow
          // But the frontend passes the ID in the URL: /api/users/ID/follow
          // So 'username' param here will technically hold the ID.
          // We rename it to targetUserId for clarity in logic.
          const { username: targetUserId } = await params;

          const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

          if (!token) {
               return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
          }

          const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
          const currentUserId = decoded.id;

          if (currentUserId === targetUserId) {
               return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
          }

          const currentUser = await User.findById(currentUserId);
          const targetUser = await User.findById(targetUserId);

          if (!currentUser || !targetUser) {
               return NextResponse.json({ error: "User not found" }, { status: 404 });
          }

          const isFollowing = currentUser.following.includes(targetUserId);

          if (isFollowing) {
               // Unfollow
               currentUser.following = currentUser.following.filter((id: any) => id.toString() !== targetUserId);
               targetUser.followers = targetUser.followers.filter((id: any) => id.toString() !== currentUserId);
          } else {
               // Follow
               currentUser.following.push(targetUserId);
               targetUser.followers.push(currentUserId);
          }

          await currentUser.save();
          await targetUser.save();

          return NextResponse.json({
               message: "Success",
               isFollowing: !isFollowing,
               followersCount: targetUser.followers.length
          }, { status: 200 });
     } catch (error: any) {
          return NextResponse.json({ error: error.message }, { status: 500 });
     }
}
