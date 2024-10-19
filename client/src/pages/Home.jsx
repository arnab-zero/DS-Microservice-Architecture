import { useEffect, useRef, useState } from "react";
import NavBar from "../components/NavBar";
import { useLocation } from "react-router-dom";

const Home = () => {
  const postRef = useRef();
  const location = useLocation();
  const { username } = location.state || {};
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await fetch("http://localhost:3500/posts/get-posts");
      if (!response.ok) {
        throw new Error("HTTP error occurred.");
      }
      const data = await response.json();
      setPosts(data);
      console.log("Posts: ", posts);
    } catch (err) {
      console.error("Error occurred: ", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [posts]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const post = postRef.current.value;
    const postData = { username: username, post: post };
    console.log("Post: ", postData);

    async function sendPostData(postData) {
      try {
        const response = await fetch(
          "http://localhost:3500/posts/create-post",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(postData),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Post data sent successfully:", data);
        } else {
          console.error("Failed to send Post data. Status:", response.status);
        }
      } catch (err) {
        console.error("Error occurred:", err);
      }
    }

    sendPostData(postData);
  };

  return (
    <div>
      <NavBar />
      <div className="grid grid-cols-5">
        <div className="mx-10 mt-4 col-span-3">
          <form onSubmit={handleSubmit}>
            <p className="pb-2 text-black text-lg font-medium">Create a post</p>
            <textarea
              name="post"
              id="post"
              className="w-[60%] h-[160px] border-2 border-blue-300 rounded-md"
              ref={postRef}
              required
            ></textarea>
            <br />
            <input
              type="submit"
              className="px-2 py-1 bg-blue-300 text-white font-md rounded-lg hover:bg-blue-400 "
            />
          </form>
          <h3 className="mt-5 mb-2 text-black text-lg font-medium">Posts</h3>
          <div>post</div>
        </div>
        <div className="col-span-2">
          <h3 className="mt-5 mb-2 text-black text-lg font-medium">
            Notifications
          </h3>
          <div>notification</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
