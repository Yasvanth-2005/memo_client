import { useState } from "react";
import { Header } from "../components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { userActions } from "../store/userSlicer";
import { useDispatch } from "react-redux";
// import { GoogleLogin } from "@react-oauth/google";
// import jwtDecode from "jwt-decode";

const Sign = () => {
  const [isSignIn, setSignIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [signData, setSignData] = useState({
    username: "",
    email: "",
    password: "",
    cpassword: "",
    image: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignData({ ...signData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const base_url = process.env.REACT_APP_BASE_URL;
    if (isSignIn) {
      try {
        const { data } = await axios.post(`${base_url}/users/signin`, {
          email: signData.email,
          password: signData.password,
        });
        dispatch(userActions.setUser(data.user));
        dispatch(userActions.setIsUser(true));
        localStorage.setItem("token", data.token);
        navigate("/");
        clearForm();
      } catch (error) {
        console.log(error);
        alert(error?.response?.data?.message || error.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      if (signData.cpassword !== signData.password) {
        alert("Password Dont Match");
        setIsLoading(false);
        return;
      }
      try {
        const { data } = await axios.post(`${base_url}/users/signup`, {
          email: signData.email,
          username: signData.username.toLowerCase().replace(" ", ""),
          password: signData.password,
          image: signData.image,
        });
        alert("User Signed up successfully");
        dispatch(userActions.setUser(data.user));
        dispatch(userActions.setIsUser(true));
        localStorage.setItem("token", data.token);
        navigate("/");
        clearForm();
      } catch (error) {
        console.log(error);
        alert(error?.response?.data?.message || error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const clearForm = () => {
    setSignData({
      username: "",
      email: "",
      password: "",
      cpassword: "",
    });
    setIsLoading(false);
  };

  return (
    <>
      <Header />
      <div
        className="container mx-auto flex justify-center items-center"
        style={{ minHeight: "calc(100vh - 60px)" }}
      >
        <form
          onSubmit={handleSubmit}
          className="w-[90%] max-w-[360px] py-4 px-3 flex flex-col items-center bg-white dark:bg-slate-900 shadow-md"
        >
          <div className="w-[30px] h-[30px] rounded-full bg-red-600 flex justify-center items-center text-white">
            <i className="bi bi-person-lock text-[15px]"></i>
          </div>
          <h5 className="text-xl dark:text-white mb-[20px]">
            {isSignIn ? "Sign In" : "Sign Up"}
          </h5>
          {!isSignIn && (
            <div className="mb-3 w-[90%]">
              <label
                htmlFor="username"
                className="mb-2 dark:text-white  font-semibold"
              >
                Username
              </label>
              <input
                required
                type="text"
                id="username"
                className="form-input focus:outline-none focus:shadow-outline"
                name="username"
                onChange={handleChange}
                value={signData.username}
              />
            </div>
          )}
          <div className="mb-3 w-[90%]">
            <label
              htmlFor="email"
              className="mb-2 dark:text-white  font-semibold"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="form-input focus:outline-none focus:shadow-outline"
              required
              name="email"
              onChange={handleChange}
              value={signData.email}
            />
          </div>
          <div className="mb-3 w-[90%]">
            <label
              htmlFor="password"
              className="mb-2 dark:text-white  font-semibold"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-input focus:outline-none focus:shadow-outline"
              name="password"
              onChange={handleChange}
              required
              value={signData.password}
            />
          </div>
          {!isSignIn && (
            <div className="mb-3 w-[90%]">
              <label
                htmlFor="cpassword"
                className="mb-2 dark:text-white font-semibold"
              >
                Confirm Password
              </label>
              <input
                required
                type="password"
                id="cpassword"
                className="form-input focus:outline-none focus:shadow-outline"
                name="cpassword"
                onChange={handleChange}
                value={signData.cpassword}
              />
            </div>
          )}
          {!isLoading ? (
            <button
              type="submit"
              className="bg-blue-500 w-[90%] mt-2 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline"
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
          {isSignIn ? (
            <>
              <p className="dark:text-white mt-2">
                Dont Have an account ?
                <span
                  className="cursor-pointer underline text-blue-500"
                  onClick={() => setSignIn(false)}
                >
                  {" "}
                  Sign Up
                </span>
              </p>
            </>
          ) : (
            <>
              <p className="dark:text-white mt-2">
                Already Have an account ?
                <span
                  className="cursor-pointer underline text-blue-500"
                  onClick={() => setSignIn(true)}
                >
                  {" "}
                  Sign In
                </span>
              </p>
            </>
          )}
          {/* {!isSignIn && (
            <div className="mt-3">
              <GoogleLogin
                onSuccess={loginSuccess}
                onError={(err) => alert("Sign In Failed")}
              />
            </div>
          )} */}
        </form>
      </div>
    </>
  );
};

export default Sign;
