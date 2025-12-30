import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Message from "@/lib/models/Message";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken";

export async function GET(req: Request, { params }: { params: Promise<{ userId: string }> }) {
     try {
          await connectDB();
          const { userId: otherUserId } = await params;
          const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

          if (!token) {
               return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
          }

          const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
          const currentUserId = decoded.id;

          // Fetch messages between current user and other user
          const messages = await Message.find({
               $or: [
                    { sender: currentUserId, receiver: otherUserId },
                    { sender: otherUserId, receiver: currentUserId }
               ]
          }).sort({ createdAt: 1 });

          const otherUser = await User.findById(otherUserId).select("username image");

          return NextResponse.json({ messages, otherUser }, { status: 200 });
     } catch (error: any) {
          return NextResponse.json({ error: error.message }, { status: 500 });
     }
}
