"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
     const router = useRouter();
     const [form, setForm] = useState({ email: "", password: "" });
     const [error, setError] = useState("");

     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          setForm({ ...form, [e.target.name]: e.target.value });
     };

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          setError("");

          try {
               const res = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
               });

               const data = await res.json();

               if (!res.ok) {
                    throw new Error(data.error || "Login failed");
               }

               router.push("/");
               router.refresh();
          } catch (err: any) {
               setError(err.message);
          }
     };

     return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
               <div className="w-full max-w-md bg-neutral-900 p-8 rounded-xl shadow-lg border border-neutral-800">
                    <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>

                    {error && (
                         <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded mb-4">
                              {error}
                         </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                         <div>
                              <label className="block text-sm font-medium mb-1">Email</label>
                              <input
                                   type="email"
                                   name="email"
                                   value={form.email}
                                   onChange={handleChange}
                                   className="w-full p-3 rounded bg-neutral-800 border border-neutral-700 focus:outline-none focus:border-blue-500"
                                   required
                              />
                         </div>
                         <div>
                              <label className="block text-sm font-medium mb-1">Password</label>
                              <input
                                   type="password"
                                   name="password"
                                   value={form.password}
                                   onChange={handleChange}
                                   className="w-full p-3 rounded bg-neutral-800 border border-neutral-700 focus:outline-none focus:border-blue-500"
                                   required
                              />
                         </div>
                         <button
                              type="submit"
                              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded font-semibold transition"
                         >
                              Log In
                         </button>
                    </form>
                    <p className="mt-4 text-center text-sm text-gray-400">
                         Don't have an account?{" "}
                         <Link href="/register" className="text-blue-400 hover:underline">
                              Sign up
                         </Link>
                    </p>
               </div>
          </div>
     );
}
