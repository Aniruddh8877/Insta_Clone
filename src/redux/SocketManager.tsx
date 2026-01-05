'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { socket } from '@/lib/socket';
import { setLikes } from './slices/likeSlice';
import { setComments } from './slices/commentSlice';

export default function SocketManager() {
     const dispatch = useDispatch();

     useEffect(() => {
          socket.connect();

          // Identify user
          fetch('/api/auth/me')
               .then(res => res.json())
               .then(data => {
                    if (data.user) {
                         socket.emit('join_user', data.user._id);
                         console.log("Joined user room:", data.user._id);
                    }
               })
               .catch(err => console.error("Socket auth failed", err));

          function onPostUpdate(event: { type: string; postId: string; data: any }) {
               console.log("Socket received update:", event);

               if (event.type === 'post:liked') {
                    dispatch(setLikes({ postId: event.postId, count: event.data.likes.length }));
                    // Note: We deliberately do NOT sync 'isLiked' (likedStatus) from the broadcast
                    // because that is user-specific. The broadcast only carries the global "ground truth"
                    // of the total count. 
               }

               if (event.type === 'post:commented') {
                    dispatch(setComments({ postId: event.postId, comments: event.data.comments }));
               }
          }

          socket.on('post:update', onPostUpdate);

          return () => {
               socket.off('post:update', onPostUpdate);
               socket.disconnect();
          };
     }, [dispatch]);

     return null;
}
