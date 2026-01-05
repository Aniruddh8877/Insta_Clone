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
