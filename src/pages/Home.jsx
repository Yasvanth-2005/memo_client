import { Header, PostForm, Posts } from "../components";

const Home = () => {
  return (
    <>
      <Header />
      <div className="mt-3 container mx-auto justify-between flex flex-col lg:flex-row">
        <Posts />
        <PostForm />
      </div>
    </>
  );
};

export default Home;
