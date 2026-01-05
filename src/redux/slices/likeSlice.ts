import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LikeState {
     likes: Record<string, number>; // postId -> count
     likedPosts: string[]; // list of postIds liked by current user
}

const initialState: LikeState = {
     likes: {},
     likedPosts: [],
};

const likeSlice = createSlice({
     name: 'likes',
     initialState,
     reducers: {
          setLikes: (state, action: PayloadAction<{ postId: string; count: number }>) => {
               state.likes[action.payload.postId] = action.payload.count;
          },
          toggleLike: (state, action: PayloadAction<string>) => {
               const postId = action.payload;
               const isLiked = state.likedPosts.includes(postId);

               if (isLiked) {
                    state.likedPosts = state.likedPosts.filter(id => id !== postId);
                    state.likes[postId] = Math.max(0, (state.likes[postId] || 1) - 1);
               } else {
                    state.likedPosts.push(postId);
                    state.likes[postId] = (state.likes[postId] || 0) + 1;
               }
          },
          setLikedStatus: (state, action: PayloadAction<{ postId: string; isLiked: boolean }>) => {
               const { postId, isLiked } = action.payload;
               const alreadyLiked = state.likedPosts.includes(postId);
               if (isLiked && !alreadyLiked) {
                    state.likedPosts.push(postId);
               } else if (!isLiked && alreadyLiked) {
                    state.likedPosts = state.likedPosts.filter(id => id !== postId);
               }
          },
     },
});

export const { setLikes, toggleLike, setLikedStatus } = likeSlice.actions;
export default likeSlice.reducer;
