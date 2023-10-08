import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    noPosts: false,
    currentPost: null,
  },
  reducers: {
    getPosts: (state, action) => {
      state.posts = [...state.posts, ...action.payload];
    },
    setPost: (state, action) => {
      state.posts = [...state.posts, action.payload];
    },
    updatePost: (state, action) => {
      state.posts = state.posts.map((post) =>
        post._id === action.payload._id
          ? {
              ...post,
              creator: action.payload.creator,
              title: action.payload.title,
              description: action.payload.description,
              tags: action.payload.tags,
              image: action.payload.image,
            }
          : post
      );
      console.log(action.payload.title);
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter((post) => post._id !== action.payload);
    },

    setNoPosts: (state, action) => {
      state.noPosts = action.payload;
    },
    currentPost: (state, action) => {
      state.currentPost = state.posts.filter(
        (post) => post._id === action.payload
      )[0]
        ? state.posts.filter((post) => post._id === action.payload)[0]
        : null;
    },
  },
});

export const postActions = postSlice.actions;
export default postSlice;
