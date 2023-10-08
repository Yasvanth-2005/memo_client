import { Link } from "react-router-dom";

const NoPage = () => {
  return (
    <>
      <div className="w-full min-h-screen flex justify-center items-center flex-col">
        <h1 className="text-[72px] font-bold dark:text-white">404</h1>
        <h3 className="text-[32px] font-semibold dark:text-white">
          Page Not Found
        </h3>
        <Link to="/">
          <button className="px-3 py-1 mt-4 border border-black dark:border-white rounded-full font-medium hover:bg-black hover:text-white dark:text-white dark:hover:bg-white dark:hover:text-black">
            Go Back To Home
          </button>
        </Link>
      </div>
    </>
  );
};

export default NoPage;
