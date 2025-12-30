import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import Post from "@/lib/models/Post";

export async function GET(req: Request, { params }: { params: Promise<{ username: string }> }) {
     try {
          await connectDB();
          const { username } = await params;

          const user = await User.findOne({ username }).select("-password -email");
          if (!user) {
               return NextResponse.json({ error: "User not found" }, { status: 404 });
          }

          const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 });

          return NextResponse.json({ user, posts }, { status: 200 });
     } catch (error: any) {
          return NextResponse.json({ error: error.message }, { status: 500 });
     }
}
