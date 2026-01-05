import { io } from "socket.io-client";

export const socket = io("https://insta-clone-server-lkww.onrender.com", {
     autoConnect: false,
     transports: ["websocket"],
     withCredentials: true,
});
