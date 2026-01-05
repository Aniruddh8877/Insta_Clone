import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Comment {
     id: string;
     text: string;
     userId: string;
     createdAt: string;
}

interface CommentState {
     comments: Record<string, Comment[]>; // postId -> comments
}

const initialState: CommentState = {
     comments: {},
};

const commentSlice = createSlice({
     name: 'comments',
     initialState,
     reducers: {
          setComments: (state, action: PayloadAction<{ postId: string; comments: Comment[] }>) => {
               state.comments[action.payload.postId] = action.payload.comments;
          },
          addComment: (state, action: PayloadAction<{ postId: string; comment: Comment }>) => {
               if (!state.comments[action.payload.postId]) {
                    state.comments[action.payload.postId] = [];
               }
               state.comments[action.payload.postId].push(action.payload.comment);
          },
     },
});

export const { setComments, addComment } = commentSlice.actions;
export default commentSlice.reducer;
