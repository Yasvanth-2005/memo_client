import { useEffect, useState } from "react";
import logo from "../assets/images/logo.svg";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { userActions } from "../store/userSlicer";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const [isDark, setIsDark] = useState(
    localStorage.getItem("isDark")
      ? JSON.parse(localStorage.getItem("isDark"))
      : false
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signOut = () => {
    dispatch(userActions.setUser(null));
    dispatch(userActions.setIsUser(false));
    localStorage.removeItem("token");
    navigate("/sign");
  };

  const user = useSelector((state) => state.user.userDetails);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("isDark", JSON.stringify(isDark));
  }, [isDark]);

  return (
    <>
      <header
        className="py-3 bg-white dark:bg-slate-900 dark:text-white"
        style={{ position: "sticky", top: "0", zIndex: "1000" }}
      >
        <div className="container mx-auto  flex justify-between items-center">
          <div className="flex justify-center items-center">
            <img
              src={logo}
              alt="memo"
              width="30"
              height="30"
              className="ml-3"
            />
            <Link to="/">
              <h3 className="ml-2 text-2xl font-semibold">Memos</h3>
            </Link>
          </div>
          <div className="mr-3 flex items-center">
            {!user ? (
              <Link to="/sign">
                <button className="text-lg transition-all font-medium border border-black dark:border-white rounded-full py-[0.5px] px-4 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black">
                  Sign In
                </button>
              </Link>
            ) : (
              <div className="flex gap-3">
                <Link to={`/user/${user._id}`}>
                  <span
                    className="w-[33px] h-[33px] rounded-full flex justify-center items-center text-lg font-bold bg-gray-300 dark:bg-slate-800"
                    title={user.username}
                  >
                    {user.image !== "" ? (
                      <img src={user.image} alt={user.username} />
                    ) : (
                      `${user.username.charAt(0).toUpperCase()}`
                    )}
                  </span>
                </Link>
                <div>
                  <button
                    onClick={signOut}
                    className="text-lg transition-all font-medium border border-black max-md:px-0 max-md:pt-[3px] max-md:border-0 dark:border-white rounded-full py-[0.5px] px-4 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                  >
                    <span className="hidden md:block">Sign Out</span>
                    <span className="block md:hidden">
                      <i className="bi bi-box-arrow-right"></i>
                    </span>
                  </button>
                </div>
              </div>
            )}
            <div
              className={`max-md:ml-2 ml-4 ${
                isDark ? "hidden" : "flex"
              } w-[30px] h-[30px] cursor-pointer bg-white text-black rounded-full justify-center items-center`}
              onClick={() => setIsDark(true)}
            >
              <i
                className="bi bi-moon-stars-fill"
                style={{ fontSize: "13px" }}
              ></i>
            </div>
            <div
              className={`max-md:ml-2 ml-4 ${
                !isDark ? "hidden" : "flex"
              } w-[30px] h-[30px] cursor-pointer bg-black text-white rounded-full justify-center items-center`}
              onClick={() => setIsDark(false)}
            >
              <i
                className="bi bi-brightness-high-fill"
                style={{ fontSize: "13px" }}
              ></i>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
export default Header;
