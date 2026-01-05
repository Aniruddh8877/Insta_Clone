"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaHeart, FaRegHeart, FaRegComment, FaTrash, FaEllipsisH, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { formatTimeAgo } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setLikes, toggleLike, setLikedStatus } from "@/redux/slices/likeSlice";
import { setComments, addComment, Comment as ReduxComment } from "@/redux/slices/commentSlice";

interface User {
     _id: string;
     username: string;
     image?: string;
}

interface Comment {
     user: { _id: string; username: string };
     text: string;
     _id: string;
}

interface Media {
     url: string;
     type: 'image' | 'video';
}

interface Post {
     _id: string;
     user: User;
     image: string; // fallback
     media?: Media[];
     caption: string;
     likes: string[];
     comments: Comment[];
     createdAt: string;
}

export default function PostCard({ post: initialPost, currentUserId }: { post: Post; currentUserId: string }) {
     // Local UI state
     const [commentText, setCommentText] = useState("");
     const [showComments, setShowComments] = useState(false);
     const [deleted, setDeleted] = useState(false);
     const [showOptions, setShowOptions] = useState(false);
     const [currentIndex, setCurrentIndex] = useState(0);

     const dispatch = useDispatch();

     // Select from Redux
     const likeCount = useSelector((state: RootState) => state.likes.likes[initialPost._id] ?? initialPost.likes.length);
     const isLiked = useSelector((state: RootState) => state.likes.likedPosts.includes(initialPost._id));
     // We need to allow for initial undefined state in Redux, falling back to props
     const comments = useSelector((state: RootState) => state.comments.comments[initialPost._id] ?? initialPost.comments);

     // Sync initial props to Redux
     useEffect(() => {
          dispatch(setLikes({ postId: initialPost._id, count: initialPost.likes.length }));
          dispatch(setLikedStatus({ postId: initialPost._id, isLiked: initialPost.likes.includes(currentUserId) }));
          // Correctly map comments if types differ, or ensure consistent types.
          // Adjust interface in slice if needed. Here assuming compatible.
          dispatch(setComments({ postId: initialPost._id, comments: initialPost.comments as any[] }));
     }, [initialPost, currentUserId, dispatch]);

     const mediaList = initialPost.media && initialPost.media.length > 0
          ? initialPost.media
          : [{ url: initialPost.image, type: 'image' }]; // Fallback

     const isOwner = initialPost.user._id === currentUserId;

     const handleLike = async () => {
          // Optimistic update
          dispatch(toggleLike(initialPost._id));

          try {
               const res = await fetch(`/api/posts/${initialPost._id}/like`, { method: "POST" });
               if (res.ok) {
                    const data = await res.json();
                    // Sync ground truth from server
                    const updatedLikes: string[] = data.likes;
                    dispatch(setLikes({ postId: initialPost._id, count: updatedLikes.length }));
                    dispatch(setLikedStatus({ postId: initialPost._id, isLiked: updatedLikes.includes(currentUserId) }));
               } else {
                    // Revert
                    dispatch(toggleLike(initialPost._id));
               }
          } catch (error) {
               console.error("Like failed", error);
               dispatch(toggleLike(initialPost._id));
          }
     };

     const handleComment = async (e: React.FormEvent) => {
          e.preventDefault();
          if (!commentText.trim()) return;

          try {
               const res = await fetch(`/api/posts/${initialPost._id}/comment`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: commentText }),
               });

               if (res.ok) {
                    const data = await res.json();
                    // The API returns all comments or the new list?
                    // Previous code: setPost({ ...post, comments: data.comments });
                    // So it returns the updated list 'comments'
                    dispatch(setComments({ postId: initialPost._id, comments: data.comments }));
                    setCommentText("");
               }
          } catch (error) {
               console.error("Comment failed", error);
          }
     };

     const handleDelete = async () => {
          if (!confirm("Are you sure you want to delete this post?")) return;
          try {
               const res = await fetch(`/api/posts/${initialPost._id}`, { method: "DELETE" });
               if (res.ok) {
                    setDeleted(true);
               }
          } catch (error) {
               console.error("Delete failed", error);
          }
     };

     const nextSlide = (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          setCurrentIndex((prev) => (prev + 1) % mediaList.length);
     };

     const prevSlide = (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          setCurrentIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);
     };

     if (deleted) return null;

     return (
          <div className="bg-black border-b md:border border-neutral-800 md:rounded-lg mb-4 md:mb-8 w-full max-w-[470px] mx-auto relative group">
               {/* Header */}
               <div className="flex items-center justify-between p-3">
                    <div className="flex items-center">
                         <Link href={`/u/${initialPost.user.username}`} className="flex items-center hover:opacity-80 transition">
                              <div className="w-8 h-8 rounded-full overflow-hidden mr-3 border border-neutral-700">
                                   <img
                                        src={initialPost.user.image || "/default-avatar.png"}
                                        alt={initialPost.user.username}
                                        className="w-full h-full object-cover"
                                   />
                              </div>
                              <span className="font-semibold text-sm">{initialPost.user.username}</span>
                         </Link>
                    </div>

                    <div className="relative">
                         <button onClick={() => setShowOptions(!showOptions)} className="text-white hover:opacity-70">
                              <FaEllipsisH />
                         </button>

                         {showOptions && (
                              <div className="absolute right-0 top-full mt-2 bg-neutral-800 border border-neutral-700 rounded shadow-lg z-10 w-32 py-1">
                                   {isOwner ? (
                                        <button
                                             onClick={handleDelete}
                                             className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-neutral-700 flex items-center gap-2"
                                        >
                                             <FaTrash size={12} /> Delete
                                        </button>
                                   ) : (
                                        <>
                                             <Link
                                                  href={`/u/${initialPost.user.username}`}
                                                  className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-neutral-700 hover:no-underline"
                                             >
                                                  View Profile
                                             </Link>
                                             <button
                                                  onClick={() => {
                                                       alert("Reported! (Demo)");
                                                       setShowOptions(false);
                                                  }}
                                                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-neutral-700"
                                             >
                                                  Report
                                             </button>
                                        </>
                                   )}
                              </div>
                         )}
                    </div>
               </div>

               {/* Media Carousel */}
               <div className="relative w-full bg-neutral-900 border-y border-neutral-800 group/media">
                    {/* Media Item */}
                    <div className="w-full">
                         {mediaList[currentIndex].type === 'video' ? (
                              <video
                                   src={mediaList[currentIndex].url}
                                   className="w-full h-auto max-h-[600px] object-contain"
                                   controls
                                   playsInline
                              />
                         ) : (
                              <Link href={`/p/${initialPost._id}`} className="block cursor-pointer">
                                   <img
                                        src={mediaList[currentIndex].url || ""}
                                        alt="Post content"
                                        className="w-full h-auto object-contain max-h-[600px]"
                                   />
                              </Link>
                         )}
                    </div>

                    {/* Navigation Buttons */}
                    {mediaList.length > 1 && (
                         <>
                              {/* Counter Badge */}
                              <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full z-20 pointer-events-none">
                                   {currentIndex + 1}/{mediaList.length}
                              </div>

                              <button
                                   onClick={prevSlide}
                                   className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white p-1.5 rounded-full hover:bg-black/80 transition z-20"
                              >
                                   <FaChevronLeft size={16} />
                              </button>
                              <button
                                   onClick={nextSlide}
                                   className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white p-1.5 rounded-full hover:bg-black/80 transition z-20"
                              >
                                   <FaChevronRight size={16} />
                              </button>

                              {/* Dots Indicator */}
                              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                                   {mediaList.map((_, idx) => (
                                        <div
                                             key={idx}
                                             className={`w-1.5 h-1.5 rounded-full ${idx === currentIndex ? 'bg-blue-500' : 'bg-white/40'}`}
                                        />
                                   ))}
                              </div>
                         </>
                    )}
               </div>

               {/* Actions */}
               <div className="p-3">
                    <div className="flex gap-4 text-2xl mb-2">
                         <button onClick={handleLike} className="hover:opacity-70 transition">
                              {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                         </button>
                         <button onClick={() => setShowComments(!showComments)} className="hover:opacity-70 transition">
                              <FaRegComment />
                         </button>
                    </div>
                    <p className="font-semibold text-sm mb-1">{likeCount} likes</p>

                    {/* Caption */}
                    <div className="mb-2">
                         <span className="font-semibold text-sm mr-2">{initialPost.user.username}</span>
                         <span className="text-sm">{initialPost.caption}</span>
                    </div>

                    {/* Comments Section */}
                    {comments && comments.length > 0 && (
                         <button
                              onClick={() => setShowComments(!showComments)}
                              className="text-gray-400 text-sm mb-2"
                         >
                              View all {comments.length} comments
                         </button>
                    )}

                    {showComments && (
                         <div className="mb-3 max-h-32 overflow-y-auto">
                              {comments && comments.map((comment: any) => (
                                   <div key={comment._id} className="text-sm mb-1">
                                        <Link href={`/u/${comment.user?.username}`} className="font-semibold mr-2 hover:opacity-80 transition">
                                             {comment.user?.username || "Unknown"}
                                        </Link>
                                        {comment.text}
                                   </div>
                              ))}
                         </div>
                    )}

                    {/* Timestamp */}
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-3">
                         {formatTimeAgo(initialPost.createdAt)}
                    </p>

                    {/* Add Comment */}
                    <form onSubmit={handleComment} className="flex border-t border-neutral-800 pt-3">
                         <input
                              type="text"
                              placeholder="Add a comment..."
                              className="bg-transparent flex-1 text-sm focus:outline-none"
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                         />
                         <button
                              type="submit"
                              disabled={!commentText.trim()}
                              className="text-blue-500 text-sm font-semibold disabled:opacity-50 ml-2"
                         >
                              Post
                         </button>
                    </form>
               </div>
          </div>
     );
}
