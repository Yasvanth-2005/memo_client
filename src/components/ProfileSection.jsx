import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Post } from "../components";
import { useNavigate } from "react-router-dom";

const ProfileSection = () => {
  const userDetails = useSelector((state) => state.user.userDetails);
  const isUser = useSelector((state) => state.user.isUser);
  const posts = useSelector((state) => state.posts.posts);
  const [userPosts, setUserPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isUser) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (isUser) {
      console.log(userDetails);
      const userPost = posts.filter(
        (post) => post.creator === userDetails.username
      );
      setUserPosts(userPost);
    }
  }, [posts]);

  return (
    <>
      <div className="container mx-auto mt-[50px] text-black dark:text-white">
        <div className="flex flex-start max-md:justify-center max-md:flex-col items-center">
          <div className="w-[200px] flex items-center justify-center">
            <div className="w-[150px] h-[150px] bg-white dark:bg-black rounded-full overflow-hidden flex items-center justify-center">
              {userDetails?.image !== "" ? (
                <img src={userDetails?.image} alt="" />
              ) : (
                <>
                  <p className="text-[6rem] mb-0">
                    {userDetails?.username.charAt(0).toUpperCase()}
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="w-[calc(100% - 200px)] max-md:w-full max-md:mt-5 flex flex-col flex-start max-md:justify-center items-start max-md:items-center">
            <h2 className="text-3xl capitalize">{userDetails?.username}</h2>
            <p className="text-gray-400">{userDetails?.email}</p>
            <div className="flex gap-3">
              <div className="mt-5 flex flex-col justify-center items-center">
                <h1 className="text-3xl font-bold">{userPosts.length}</h1>
                <p className="text-xl font-semibold">Posts</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-[40px] py-5 px-[25px] max-md:px-3">
          <h1 className="text-3xl">Posts</h1>
          <div className="grid grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 mt-[30px] place-items-center gap-3">
            {userPosts.map((post, index) => (
              <Post index={index} post={post} user={userDetails} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSection;
