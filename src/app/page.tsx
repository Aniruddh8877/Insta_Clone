"use client";

import PostCard from "@/components/PostCard";
import { useEffect, useState } from "react";
import Link from "next/link"; // Added import

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch current user
        const userRes = await fetch("/api/auth/me");
        if (userRes.ok) {
          const userData = await userRes.json();
          setCurrentUser(userData.user);
        }

        // Fetch posts
        const postsRes = await fetch("/api/posts");
        if (postsRes.ok) {
          const postsData = await postsRes.json();
          setPosts(postsData.posts);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="bg-black min-h-screen text-white flex items-center justify-center">Loading...</div>;

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Instagram Clone</h1>
        <p className="mb-8 text-xl">Login to see posts from your friends.</p>
        <div className="flex gap-4">
          <Link href="/login" className="bg-blue-600 px-6 py-2 rounded font-bold hover:bg-blue-700">Login</Link>
          <Link href="/register" className="bg-neutral-800 px-6 py-2 rounded font-bold hover:bg-neutral-700">Register</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <main className="max-w-xl mx-auto mt-6 px-4">
        {posts.map((post: any) => (
          // Pass key prop here
          <PostCard key={post._id} post={post} currentUserId={currentUser._id} />
        ))}

        {posts.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <p>No posts yet.</p>
            <Link href="/create" className="text-blue-500 hover:underline">Create the first one!</Link>
          </div>
        )}
      </main>
    </div>
  );
}
