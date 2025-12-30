"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProfilePage() {
     const router = useRouter();
     // ... state declarations ...
     const [user, setUser] = useState<any>(null);
     const [isEditing, setIsEditing] = useState(false);
     const [bio, setBio] = useState("");
     const [image, setImage] = useState<File | null>(null);
     const [preview, setPreview] = useState("");
     const [loading, setLoading] = useState(false);

     // ... (rest of the component logic remains same until return)

     useEffect(() => {
          // Fetch user info
          fetch("/api/auth/me")
               .then((res) => {
                    if (!res.ok) throw new Error("Not authenticated");
                    return res.json();
               })
               .then((data) => {
                    setUser(data.user);
                    setBio(data.user.bio || "");
                    setPreview(data.user.image || "/default-avatar.png");
               })
               .catch(() => router.push("/login"));

          // Fetch user posts
          fetch("/api/user/posts")
               .then((res) => res.json())
               .then((data) => setPosts(data.posts || []))
               .catch((err) => console.error("Failed to fetch posts", err));
     }, [router]);

     // ... (handlers remain the same) ...
     const [posts, setPosts] = useState([]); // Add posts state

     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (file) {
               setImage(file);
               setPreview(URL.createObjectURL(file));
          }
     };

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          setLoading(true);

          const formData = new FormData();
          formData.append("bio", bio);
          if (image) {
               formData.append("image", image);
          }

          try {
               const res = await fetch("/api/user/profile", {
                    method: "PUT",
                    body: formData,
               });

               if (!res.ok) throw new Error("Failed to update profile");

               const data = await res.json();
               setUser(data.user);
               setIsEditing(false);
          } catch (error) {
               console.error(error);
               alert("Failed to update profile");
          } finally {
               setLoading(false);
          }
     };

     if (!user) return <div className="text-white text-center mt-20">Loading...</div>;

     return (
          <div className="min-h-screen bg-black text-white p-4 pt-20 flex flex-col items-center">
               <div className="w-full max-w-2xl mb-4">
                    <Link href="/" className="text-gray-400 hover:text-white transition flex items-center gap-2">
                         &larr; Return to Home
                    </Link>
               </div>
               <div className="w-full max-w-2xl">
                    <div className="flex flex-col md:flex-row items-center gap-8 mb-8 border-b border-neutral-800 pb-8">
                         <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-neutral-700">
                              {/* Use reliable placeholder if no image */}
                              <img
                                   src={preview || "https://via.placeholder.com/150"}
                                   alt="Profile"
                                   className="w-full h-full object-cover"
                              />
                         </div>

                         <div className="flex-1 text-center md:text-left">
                              <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                                   <h1 className="text-2xl font-bold">{user.username}</h1>
                                   <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="px-4 py-1.5 bg-neutral-800 rounded-md font-semibold text-sm hover:bg-neutral-700 transition"
                                   >
                                        {isEditing ? "Cancel" : "Edit Profile"}
                                   </button>
                              </div>

                              {!isEditing ? (
                                   <>
                                        <div className="flex gap-6 mb-4 justify-center md:justify-start">
                                             <span className="font-medium"><strong>{posts.length}</strong> posts</span>
                                        </div>
                                        <p className="font-medium">{user.email}</p>
                                        <p className="mt-4 text-gray-300 whitespace-pre-wrap">{user.bio || "No bio yet."}</p>
                                   </>
                              ) : (
                                   <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                             <label className="block text-sm text-gray-400 mb-1">Update Profile Photo</label>
                                             <input
                                                  type="file"
                                                  accept="image/*"
                                                  onChange={handleImageChange}
                                                  className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-neutral-800 file:text-white hover:file:bg-neutral-700"
                                             />
                                        </div>
                                        <div>
                                             <label className="block text-sm text-gray-400 mb-1">Bio</label>
                                             <textarea
                                                  value={bio}
                                                  onChange={(e) => setBio(e.target.value)}
                                                  className="w-full bg-neutral-900 border border-neutral-800 rounded p-2 text-white focus:outline-none focus:border-neutral-600"
                                                  rows={3}
                                             />
                                        </div>
                                        <button
                                             type="submit"
                                             disabled={loading}
                                             className="bg-blue-600 px-6 py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
                                        >
                                             {loading ? "Saving..." : "Save Changes"}
                                        </button>
                                   </form>
                              )}
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
                    </div>
               </div>
          </div>
     );
}
