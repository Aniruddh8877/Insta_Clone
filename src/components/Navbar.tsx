"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaInstagram, FaRegPaperPlane } from "react-icons/fa";

export default function Navbar() {
     const router = useRouter();
     const [user, setUser] = useState<{ username: string } | null>(null);

     useEffect(() => {
          async function fetchUser() {
               try {
                    const res = await fetch("/api/auth/me");
                    if (res.ok) {
                         const data = await res.json();
                         setUser(data.user);
                    }
               } catch (error) {
                    console.error("Failed to fetch user", error);
               }
          }
          fetchUser();
     }, []);

     const handleLogout = async () => {
          try {
               await fetch("/api/auth/logout");
               setUser(null);
               router.push("/login");
               router.refresh();
          } catch (error) {
               console.error("Logout failed", error);
          }
     };

     return (
          <nav className="flex items-center justify-between p-4 bg-neutral-900 text-white shadow-md">
               <Link href="/" className="text-xl font-bold">
                    Instagram Clone
               </Link>
               <div className="flex gap-4">
                    {user ? (
                         <>
                              <Link href="/create" className="text-2xl hover:text-gray-300 px-2" title="Create Post">
                                   +
                              </Link>
                              <Link href="/messages" className="text-xl hover:text-gray-300 px-2" title="Messages">
                                   <FaRegPaperPlane />
                              </Link>
                              <Link href="/profile" className="self-center hover:underline">
                                   {user.username}
                              </Link>
                              <button
                                   onClick={handleLogout}
                                   className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition"
                              >
                                   Logout
                              </button>
                         </>
                    ) : (
                         <>
                              <Link
                                   href="/login"
                                   className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition"
                              >
                                   Login
                              </Link>
                              <Link
                                   href="/register"
                                   className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md transition"
                              >
                                   Register
                              </Link>
                         </>
                    )}
               </div>
          </nav>
     );
}
