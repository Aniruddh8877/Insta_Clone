import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Post from "@/lib/models/Post";

export async function GET() {
     await connectDB();
     const latestPost = await Post.findOne().sort({ createdAt: -1 });
     return NextResponse.json({ latestPost });
}
