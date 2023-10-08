import "./App.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route, useNavigate } from "react-router-dom";
import { postActions } from "./store/postSlicer";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Home, Sign, NoPage, Profile, PostPage } from "./pages";
import { userActions } from "./store/userSlicer";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPosts = async () => {
      const base_url = process.env.REACT_APP_BASE_URL;
      try {
        const { data } = await axios.get(`${base_url}/posts`);
        if (!data.length > 0) {
          dispatch(postActions.setNoPosts(true));
        }
        dispatch(postActions.getPosts(data));
        dispatch(userActions.setIsUser(true));
      } catch (error) {
        alert(error?.response?.data.message || error.message);
        if (error?.response?.data.message == "Invalid Session") {
          navigate("/sign");
        }
        console.error(error);
      }
    };
    const fetchUser = async () => {
      const base_url = process.env.REACT_APP_BASE_URL;
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const { data } = await axios.get(`${base_url}/users`, {
            headers: {
              Authorization: `bearer ${token}`,
            },
          });
          dispatch(userActions.setUser(data.user));
        } catch (error) {
          alert(error?.response?.data.message || error.message);
          console.error(error);
        }
      }
    };
    fetchPosts();
    fetchUser();
  }, [dispatch]);

  return (
    <main className="bg-blue-50 dark:bg-slate-800 min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign" element={<Sign />} />
        <Route path="/user/:id" element={<Profile />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </main>
  );
}

export default App;
