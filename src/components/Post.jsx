import axios from "axios";
import { postActions } from "../store/postSlicer";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

const Post = ({ post, index, user }) => {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const setCurrentPost = (id) => {
    dispatch(postActions.currentPost(id));
    if (window.location.pathname !== "/") {
      navigate("/");
    }
  };

  const deletePost = async (id) => {
    if (window.confirm(`Are you sure you want to delete`)) {
      setIsDeleteLoading(id);
      try {
        const base_url = process.env.REACT_APP_BASE_URL;
        const token = localStorage.getItem("token");
        await axios.delete(`${base_url}/posts/${id}`, {
          headers: {
            Authorization: `bearer ${token}`,
          },
        });
        dispatch(postActions.deletePost(id));
        alert("Post Deleted Successfully");
      } catch (error) {
        console.log(error);
        alert(error?.response?.data.message || error.message);
      } finally {
        setIsDeleteLoading(null);
      }
    }
  };

  return (
    <div key={post._id}>
      <div className="w-[220px] shadow-md bg-white dark:bg-slate-900 dark:text-white text-black rounded overflow-hidden">
        <div className="relative">
          <Link to={`/post/${post._id}`}>
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-[200px]"
            />
          </Link>
          {user && user.username === post.creator && (
            <div
              title="Edit"
              onClick={() => setCurrentPost(post._id)}
              className="absolute top-1 right-1 w-[25px] h-[25px] cursor-pointer flex justify-center items-center rounded-full bg-gray-600 dark:bg-slate-900"
            >
              <i className="bi bi-three-dots text-white"></i>
            </div>
          )}
        </div>
        <>
          <div className="flex flex-col">
            <Link to={`/post/${post._id}`}>
              <h4 className="text-center text-xl font-semibold py-2 ">
                {post.title}
              </h4>
            </Link>
            <Link to={`/post/${post._id}`}>
              <p className="px-1 pb-2 text-md" style={{ textIndent: "30px" }}>
                {`${post.description.slice(0, 40)}....`}
              </p>
            </Link>
            <div className="flex justify-around items-center my-2">
              <button className="dark:text-black py-1 px-2 bg-blue-400 hover:bg-blue-500 rounded text-sm font-semibold">
                {user && user.username === post.creator ? (
                  <>
                    <i className="bi bi-hand-thumbs-up-fill"></i> {post.likes}
                  </>
                ) : (
                  <>
                    Like <i className="bi bi-hand-thumbs-up"></i>
                  </>
                )}
              </button>
              <button className="dark:text-black py-1 px-2 bg-green-400 hover:bg-green-500 rounded text-sm font-semibold">
                Share <i className="bi bi-share"></i>
              </button>
              {user && user.username === post.creator && (
                <button
                  className="dark:text-black py-1 px-2 bg-red-400 hover:bg-red-500 rounded text-sm font-semibold"
                  onClick={() => deletePost(post._id)}
                >
                  {isDeleteLoading && isDeleteLoading === post._id ? (
                    <>
                      <div role="status">
                        <svg
                          aria-hidden="true"
                          className="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                        <span className="sr-only">Loading...</span>
                      </div>
                    </>
                  ) : (
                    <>
                      Delete <i className="bi bi-trash"></i>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </>
      </div>
    </div>
  );
};

export default Post;
