import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Message from "@/lib/models/Message";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
     try {
          await connectDB();
          const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

          if (!token) {
               return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
          }

          const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
          const senderId = decoded.id;

          const { receiverId, content } = await req.json();

          if (!receiverId || !content) {
               return NextResponse.json({ error: "Missing fields" }, { status: 400 });
          }

          const newMessage = await Message.create({
               sender: senderId,
               receiver: receiverId,
               content
          });

          // Notify Socket Server (Sync Real-time)
          try {
               await fetch("https://insta-clone-server-lkww.onrender.com/api/socket/update", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                         type: "message:new",
                         postId: "dm", // Placeholder
                         receiverId,
                         data: newMessage
                    })
               });
          } catch (error) {
               console.error("Socket notification failed:", error);
          }

          return NextResponse.json({ message: "Sent", data: newMessage }, { status: 201 });
     } catch (error: any) {
          return NextResponse.json({ error: error.message }, { status: 500 });
     }
}
