import { useEffect, useState } from "react";
import FileBase from "react-file-base64";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { postActions } from "../store/postSlicer";
import { Link } from "react-router-dom";

const PostForm = () => {
  const dispatch = useDispatch();
  const currentPost = useSelector((state) => state.posts.currentPost);
  const user = useSelector((state) => state.user.userDetails);
  const [patchCreator, setPatchCreator] = useState(null);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    tags: [],
  });

  useEffect(() => {
    if (currentPost) {
      setTags(currentPost.tags);
      setFormData({
        title: currentPost.title,
        description: currentPost.description,
        image: currentPost.image,
      });
      setPatchCreator(currentPost.creator);
    }
  }, [currentPost]);

  const handleTags = (e) => {
    if (e.key === "Enter" && e.target.value !== "") {
      e.preventDefault();
      setTags([...tags, e.target.value]);
      e.target.value = "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
  };

  const clearForm = () => {
    setTags([]);
    setFormData({
      title: "",
      description: "",
      image: "",
    });
    const fileInput = document.getElementById("file-input");
    if (fileInput) {
      fileInput.value = "";
    }
    dispatch(postActions.currentPost(""));
    setPatchCreator(null);
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (formData.image === "") {
      alert("Select Image");
      setIsLoading(false);
      return;
    }
    try {
      const base_url = process.env.REACT_APP_BASE_URL;
      const token = localStorage.getItem("token");
      if (!currentPost) {
        const { data } = await axios.post(
          `${base_url}/posts`,
          {
            creator: user.username,
            title: formData.title,
            tags: tags,
            description: formData.description,
            image: formData.image,
          },
          {
            headers: {
              Authorization: `bearer ${token}`,
            },
          }
        );
        dispatch(postActions.setPost(data));
        dispatch(postActions.setNoPosts(false));
        alert("Post created successfully");
      } else {
        const id = currentPost._id;
        const { data } = await axios.patch(
          `${base_url}/posts/${id}`,
          {
            creator: patchCreator,
            title: formData.title,
            tags: tags,
            description: formData.description,
            image: formData.image,
          },
          {
            headers: {
              Authorization: `bearer ${token}`,
            },
          }
        );
        dispatch(
          postActions.updatePost({
            _id: id,
            creator: patchCreator,
            title: formData.title,
            tags: tags,
            description: formData.description,
            image: formData.image,
          })
        );
        dispatch(postActions.currentPost(null));
        console.log(data);
        alert("Post Updated Successfully");
      }
    } catch (error) {
      console.log(error);
      alert(error?.response?.data.message || error.message);
    } finally {
      setIsLoading(false);
      clearForm();
    }
  };

  return (
    <div className="max-lg:mt-[50px] flex justify-center w-full lg:max-w-[400px]">
      <form
        className="bg-white dark:bg-slate-900 text-black dark:text-white shadow-md rounded px-3 pt-3 mt-3 pb-8 mb-4 w-[320px]"
        onSubmit={handleSubmit}
        style={{ height: "fit-content" }}
      >
        {user ? (
          <>
            <h5 className="text-lg font-medium text-center mb-3">
              {!currentPost ? "Create a Post" : "Edit a Post"}
            </h5>
            <div className="mb-3">
              <input
                className="form-input focus:outline-none focus:shadow-outline"
                name="title"
                type="text"
                placeholder="Title"
                required
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <textarea
                className="form-input focus:outline-none focus:shadow-outline"
                name="description"
                placeholder="Description"
                required
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="mb-3">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3  text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="tags"
                type="text"
                placeholder="Tags (type and enter)"
                onKeyDown={handleTags}
              />
              {tags.length > 0 && (
                <div className="my-2 px-2 flex items-center flex-wrap">
                  {tags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center align-center mr-4 bg-gray-200 dark:bg-slate-800 py-1 px-3 rounded mt-1"
                    >
                      <p className="mr-2 text-md font-semibold">{tag}</p>
                      <button
                        type="button"
                        className="w-[18px] h-[18px] rounded-full bg-gray-400 dark:bg-slate-900 flex items-end pt-5 justify-center text-white"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="file-input" className="mb-2 font-semibold">
                Image
              </label>
              <FileBase
                className="mt-1"
                id="file-input"
                type="file"
                required
                multiple={false}
                onDone={({ base64 }) =>
                  setFormData({ ...formData, image: base64 })
                }
              />
            </div>
            {!isLoading ? (
              <button
                type="submit"
                className="bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Submit
              </button>
            ) : (
              <div className="text-center">
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
              </div>
            )}
            <button
              type="button"
              className="bg-red-500 mt-2 w-full hover:bg-red-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={clearForm}
            >
              Clear
            </button>
          </>
        ) : (
          <>
            <p className="mt-3 text-lg text-center capitalize">
              you have to sign in to create posts
            </p>
            <Link to="/sign">
              <button className="text-lg w-full mt-5 mx-auto transition-all font-medium border border-black dark:border-white rounded-full py-1 px-4 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black">
                Sign In
              </button>
            </Link>
          </>
        )}
      </form>
    </div>
  );
};

export default PostForm;
