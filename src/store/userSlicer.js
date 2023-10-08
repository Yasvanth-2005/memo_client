import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { userDetails: null, userPosts: null, isUser: false },
  reducers: {
    setUser: (state, action) => {
      state.userDetails = action.payload;
    },
    setUserPosts: (state, action) => {
      state.userPosts = action.payload;
    },
    setIsUser: (state, action) => {
      state.isUser = action.payload;
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice;
