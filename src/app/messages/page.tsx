"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MessagesPage() {
     const [users, setUsers] = useState([]);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
          fetch("/api/messages")
               .then((res) => res.json())
               .then((data) => setUsers(data.users || []))
               .catch((err) => console.error(err))
               .finally(() => setLoading(false));
     }, []);

     return (
          <div className="min-h-screen bg-black text-white p-4 pt-20 flex flex-col items-center">
               <div className="w-full max-w-md">
                    <h1 className="text-2xl font-bold mb-6">Messages</h1>
                    <p className="text-gray-400 mb-4">Start a conversation with people you follow:</p>

                    {loading ? (
                         <div>Loading...</div>
                    ) : (
                         <div className="flex flex-col gap-2">
                              {users.map((user: any) => (
                                   <Link
                                        key={user._id}
                                        href={`/messages/${user._id}`}
                                        className="flex items-center gap-3 p-3 bg-neutral-900 rounded-lg hover:bg-neutral-800 transition"
                                   >
                                        <div className="w-10 h-10 rounded-full overflow-hidden border border-neutral-700">
                                             <img src={user.image || "/default-avatar.png"} alt={user.username} className="w-full h-full object-cover" />
                                        </div>
                                        <span className="font-semibold">{user.username}</span>
                                   </Link>
                              ))}
                              {users.length === 0 && <p className="text-gray-500">You are not following anyone yet.</p>}
                         </div>
                    )}
               </div>
          </div>
     );
}
