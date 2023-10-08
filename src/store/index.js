import { configureStore } from "@reduxjs/toolkit";
import postSlice from "./postSlicer";
import userSlice from "./userSlicer";

const store = configureStore({
  reducer: {
    posts: postSlice.reducer,
    user: userSlice.reducer,
  },
});

export default store;
