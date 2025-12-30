import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
     try {
          await connectDB();
          const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

          if (!token) {
               return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
          }

          const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
          const currentUserId = decoded.id;

          const user = await User.findById(currentUserId).populate("following", "username image");

          // Ideally we would look at Message history to find recent conversations,
          // but for simplicity, we will just list the people the user is following as potential chat contacts.

          return NextResponse.json({ users: user.following }, { status: 200 });
     } catch (error: any) {
          return NextResponse.json({ error: error.message }, { status: 500 });
     }
}
