"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreatePostPage() {
     const router = useRouter();
     const [caption, setCaption] = useState("");
     const [mediaFiles, setMediaFiles] = useState<File[]>([]);
     const [previews, setPreviews] = useState<string[]>([]);
     const [loading, setLoading] = useState(false);

     const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const files = e.target.files;
          if (files) {
               const fileArray = Array.from(files);
               setMediaFiles(fileArray);
               setPreviews(fileArray.map(file => URL.createObjectURL(file)));
          }
     };

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          if (mediaFiles.length === 0) return;
          setLoading(true);

          const formData = new FormData();
          formData.append("caption", caption);
          mediaFiles.forEach((file) => {
               formData.append("files", file);
          });

          try {
               const res = await fetch("/api/posts", {
                    method: "POST",
                    body: formData,
               });

               if (!res.ok) throw new Error("Failed to create post");

               router.push("/");
               router.refresh();
          } catch (error) {
               console.error(error);
               alert("Failed to create post");
          } finally {
               setLoading(false);
          }
     };

     return (
          <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center">
               <div className="w-full max-w-md mt-4 md:mt-10">
                    <div className="flex justify-between items-center mb-6">
                         <Link href="/" className="text-gray-400 hover:text-white">Cancel</Link>
                         <h1 className="text-xl font-bold">New Post</h1>
                         <button
                              onClick={handleSubmit}
                              className="text-blue-500 font-semibold disabled:opacity-50 hover:text-blue-400"
                              disabled={loading || mediaFiles.length === 0}
                         >
                              {loading ? "Sharing..." : "Share"}
                         </button>
                    </div>

                    <div className="flex flex-col gap-4">
                         {/* Media Upload Area */}
                         <div className={`bg-neutral-900 rounded-lg flex items-center justify-center overflow-hidden border border-neutral-800 relative ${previews.length > 0 ? 'p-2' : ''}`}>
                              {previews.length > 0 ? (
                                   <div className="grid grid-cols-2 gap-2 w-full">
                                        {previews.map((src, index) => (
                                             <div key={index} className="aspect-square relative">
                                                  {mediaFiles[index].type.startsWith('video') ? (
                                                       <video src={src} className="w-full h-full object-cover rounded" />
                                                  ) : (
                                                       <img src={src} alt="Preview" className="w-full h-full object-cover rounded" />
                                                  )}
                                             </div>
                                        ))}
                                   </div>
                              ) : (
                                   <label className="cursor-pointer flex flex-col items-center p-8 text-center text-gray-400 hover:text-gray-200 w-full aspect-square justify-center">
                                        <span className="text-4xl mb-2">📸</span>
                                        <span className="text-sm font-semibold">Select photos or videos</span>
                                        <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleMediaChange} />
                                   </label>
                              )}
                         </div>

                         {/* Caption */}
                         <textarea
                              placeholder="Write a caption..."
                              className="w-full bg-transparent border-b border-neutral-800 p-3 text-sm focus:outline-none resize-none"
                              rows={3}
                              value={caption}
                              onChange={(e) => setCaption(e.target.value)}
                         />
                    </div>
               </div>
          </div>
     );
}
