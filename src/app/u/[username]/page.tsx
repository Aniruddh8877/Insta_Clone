"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PublicProfilePage() {
     const params = useParams();
     const username = params.username as string;

     const [profileUser, setProfileUser] = useState<any>(null);
     const [currentUser, setCurrentUser] = useState<any>(null);
     const [isFollowing, setIsFollowing] = useState(false);
     const [posts, setPosts] = useState([]);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
          async function fetchData() {
               try {
                    // Fetch Current User
                    const meRes = await fetch("/api/auth/me");
                    let myId = null;
                    if (meRes.ok) {
                         const meData = await meRes.json();
                         setCurrentUser(meData.user);
                         myId = meData.user._id;
                    }

                    // Fetch Profile User
                    const res = await fetch(`/api/users/${username}`);
                    if (!res.ok) throw new Error("User not found");
                    const data = await res.json();
                    setProfileUser(data.user);
                    setPosts(data.posts || []);

                    // Check Follow Status
                    if (data.user.followers && myId) {
                         setIsFollowing(data.user.followers.includes(myId));
                    }
               } catch (error) {
                    console.error(error);
               } finally {
                    setLoading(false);
               }
          }
          if (username) fetchData();
     }, [username]);

     const handleFollow = async () => {
          if (!currentUser) return;
          try {
               const res = await fetch(`/api/users/${profileUser._id}/follow`, { method: "POST" });
               if (res.ok) {
                    const data = await res.json();
                    setIsFollowing(data.isFollowing);
                    setProfileUser((prev: any) => ({
                         ...prev,
                         followers: {
                              ...prev.followers,
                              length: data.followersCount
                         }
                    }));
               }
          } catch (error) {
               console.error("Follow failed", error);
          }
     };

     if (loading) return <div className="text-white text-center mt-20">Loading...</div>;

     if (!profileUser) {
          return <div className="text-white text-center mt-20">User not found. <Link href="/" className="text-blue-500">Return Home</Link></div>;
     }

     return (
          <div className="min-h-screen bg-black text-white p-4 md:pt-10 flex flex-col items-center">
               <div className="w-full max-w-4xl mb-4">
                    <Link href="/" className="text-gray-400 hover:text-white transition flex items-center gap-2">
                         &larr; Return to Home
                    </Link>
               </div>
               <div className="w-full max-w-4xl">
                    <div className="flex flex-col md:flex-row items-center gap-8 mb-8 border-b border-neutral-800 pb-8">
                         <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-neutral-700">
                              <img
                                   src={profileUser.image || "/default-avatar.png"}
                                   alt="Profile"
                                   className="w-full h-full object-cover"
                              />
                         </div>

                         <div className="flex-1 text-center md:text-left">
                              <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
                                   <h1 className="text-2xl font-bold">{profileUser.username}</h1>
                                   {currentUser && currentUser._id !== profileUser._id && (
                                        <div className="flex gap-2">
                                             <button
                                                  onClick={handleFollow}
                                                  className={`px-4 py-1.5 rounded font-semibold text-sm transition ${isFollowing ? "bg-neutral-800 text-white" : "bg-blue-600 text-white"
                                                       }`}
                                             >
                                                  {isFollowing ? "Following" : "Follow"}
                                             </button>
                                             <Link
                                                  href={`/messages/${profileUser._id}`}
                                                  className="px-4 py-1.5 bg-neutral-800 rounded font-semibold text-sm hover:bg-neutral-700 transition"
                                             >
                                                  Message
                                             </Link>
                                        </div>
                                   )}
                              </div>
                              <div className="flex gap-6 mb-4 justify-center md:justify-start">
                                   <span className="font-medium"><strong>{posts.length}</strong> posts</span>
                                   <span className="font-medium"><strong>{profileUser.followers?.length || 0}</strong> followers</span>
                                   <span className="font-medium"><strong>{profileUser.following?.length || 0}</strong> following</span>
                              </div>
                              <p className="mt-4 text-gray-300 whitespace-pre-wrap">{profileUser.bio || "No bio yet."}</p>
                         </div>
                    </div>

                    {/* Posts Grid */}
                    <div className="grid grid-cols-3 gap-1 md:gap-4">
                         {posts.map((post: any) => (
                              <div key={post._id} className="aspect-square bg-neutral-900 relative group overflow-hidden">
                                   <img src={post.image} alt="User post" className="w-full h-full object-cover" />
                                   <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white font-bold flex items-center gap-2">
                                             ❤️ {post.likes.length}
                                        </span>
                                   </div>
                              </div>
                         ))}
                         {posts.length === 0 && (
                              <p className="col-span-3 text-center text-gray-500 py-10">No posts yet.</p>
                         )}
                    </div>
               </div>
          </div>
     );
}
