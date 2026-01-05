import { configureStore } from '@reduxjs/toolkit';
import likeReducer from './slices/likeSlice';
import commentReducer from './slices/commentSlice';

export const store = configureStore({
     reducer: {
          likes: likeReducer,
          comments: commentReducer,
     },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
