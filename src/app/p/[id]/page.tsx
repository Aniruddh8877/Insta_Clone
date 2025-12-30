"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import PostCard from "@/components/PostCard";

export default function SinglePostPage() {
     const params = useParams();
     const id = params.id as string;
     const router = useRouter();

     const [post, setPost] = useState<any>(null);
     const [currentUser, setCurrentUser] = useState<any>(null);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
          async function fetchData() {
               try {
                    const meRes = await fetch("/api/auth/me");
                    if (meRes.ok) {
                         const meData = await meRes.json();
                         setCurrentUser(meData.user);
                    }

                    const res = await fetch(`/api/posts/${id}`);
                    if (!res.ok) throw new Error("Post not found");
                    const data = await res.json();
                    setPost(data.post);
               } catch (error) {
                    console.error(error);
               } finally {
                    setLoading(false);
               }
          }
          if (id) fetchData();
     }, [id]);

     if (loading) return <div className="text-white text-center mt-20">Loading...</div>;

     if (!post) return <div className="text-white text-center mt-20">Post not found. <Link href="/" className="text-blue-500">Return Home</Link></div>;

     return (
          <div className="min-h-screen bg-black text-white p-4 pt-20 flex flex-col items-center">
               <div className="w-full max-w-md mb-4">
                    <Link href="/" className="text-gray-400 hover:text-white transition flex items-center gap-2">
                         &larr; Return to Home
                    </Link>
               </div>
               {currentUser && (
                    <PostCard post={post} currentUserId={currentUser._id} />
               )}
          </div>
     );
}
