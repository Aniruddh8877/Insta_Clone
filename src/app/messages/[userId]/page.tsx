"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { socket } from "@/lib/socket";

export default function ChatPage() {
     const params = useParams();
     const userId = params.userId as string;

     const [messages, setMessages] = useState<any[]>([]);
     const [otherUser, setOtherUser] = useState<any>(null);
     const [newMessage, setNewMessage] = useState("");
     const messagesEndRef = useRef<HTMLDivElement>(null);

     const scrollToBottom = () => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
     };




     useEffect(() => {
          // Initial fetch
          fetch(`/api/messages/${userId}`)
               .then((res) => res.json())
               .then((data) => {
                    setMessages(data.messages || []);
                    setOtherUser(data.otherUser);
                    scrollToBottom();
               })
               .catch((err) => console.error(err));

          // Real-time listener
          const handleNewMessage = (msg: any) => {
               // Check if this message belongs to the current conversation
               // 1. If I received it from the user I'm looking at (msg.sender === userId)
               // 2. If I sent it (msg.sender === myId) - handled by optimistic update usually, but good to sync? 
               //    Actually, my own messages are added via handleSend. 
               //    Avoiding duplicates: check if ID exists?

               if (msg.sender === userId) {
                    setMessages((prev) => [...prev, msg]);
                    scrollToBottom();
               }
          };

          socket.on("message:new", handleNewMessage);

          return () => {
               socket.off("message:new", handleNewMessage);
          };
     }, [userId]);

     useEffect(() => {
          scrollToBottom();
     }, [messages]);

     const handleSend = async (e: React.FormEvent) => {
          e.preventDefault();
          if (!newMessage.trim()) return;

          try {
               const res = await fetch("/api/messages/send", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ receiverId: userId, content: newMessage }),
               });

               if (res.ok) {
                    setNewMessage("");
                    // Optimistic update or wait for poll
                    const data = await res.json();
                    setMessages([...messages, data.data]);
               }
          } catch (error) {
               console.error("Failed to send", error);
          }
     };

     if (!otherUser) return <div className="bg-black min-h-screen text-white p-10 text-center">Loading chat...</div>;

     return (
          <div className="bg-black min-h-screen text-white flex flex-col">
               {/* Chat Header */}
               <div className="sticky top-0 bg-neutral-900 border-b border-neutral-800 p-4 flex items-center gap-3">
                    <Link href="/messages" className="text-gray-400 text-xl">&larr;</Link>
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-neutral-700">
                         <img src={otherUser.image || "/default-avatar.png"} alt={otherUser.username} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-bold">{otherUser.username}</span>
               </div>

               {/* Messages Area */}
               <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2 pb-20">
                    {messages.map((msg) => {
                         const isMe = msg.receiver === userId; // If receiver is the other user, then I sent it
                         // Wait, logic check: 
                         // If I am looking at chat with User B (userId). 
                         // Message: sender=Me, receiver=UserB. -> isMe = true (I sent it)
                         // Message: sender=UserB, receiver=Me. -> isMe = false (They sent it)

                         // However, I don't have 'myId' easily available here unless I decode token or fetch 'me'.
                         // Alternative: Check if sender === userId. If sender is the other user, then it's them.
                         const isFromOther = msg.sender === userId;

                         return (
                              <div key={msg._id} className={`max-w-[70%] px-4 py-2 rounded-2xl ${!isFromOther
                                   ? "bg-blue-600 self-end rounded-br-none"
                                   : "bg-neutral-800 self-start rounded-bl-none"
                                   }`}>
                                   {msg.content}
                              </div>
                         );
                    })}
                    <div ref={messagesEndRef} />
               </div>

               {/* Input Area */}
               <form onSubmit={handleSend} className="fixed bottom-0 w-full bg-black border-t border-neutral-800 p-4 flex gap-2">
                    <input
                         type="text"
                         className="flex-1 bg-neutral-900 border border-neutral-800 rounded-full px-4 py-2 focus:outline-none focus:border-neutral-600"
                         placeholder="Message..."
                         value={newMessage}
                         onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button
                         type="submit"
                         disabled={!newMessage.trim()}
                         className="text-blue-500 font-bold px-4 disabled:opacity-50"
                    >
                         Send
                    </button>
               </form>
          </div>
     );
}
