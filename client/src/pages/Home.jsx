import { useContext, useEffect, useRef, useState } from "react";
import NavBar from "../components/NavBar";
import axios from "axios";
import Notification from "../components/Notification";
import { AuthContext } from "../contexts/AuthProvider";
import Post from "../components/Post";

const Home = () => {
  const postRef = useRef();
  const [posts, setPosts] = useState([]);
  const [file, setFile] = useState(null);
  const [pasteVisible, setPasteVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { authInfo } = useContext(AuthContext);
  const { userId, username } = authInfo.user;

  // console.log("Auth info from home: ", authInfo);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:3500/posts/get-posts");

      if (response.status === 200) {
        // console.log(response.data.data);
        // console.log("Userid: ", userId);
        const postsOfOthers = response.data.data.filter(
          (post) => post.userId !== userId
        );
        setPosts(postsOfOthers);
        // console.log("Posts", posts);
        // console.log("net posts: ", postsOfOthers);
      } else {
        throw new Error("HTTP error occurred.");
      }
    } catch (err) {
      console.error("Error occurred: ", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3500/notifications/get-notifications"
      );

      if (response.status === 200) {
        setNotifications(response.data.data);
        console.log(response.data.data);
      } else {
        throw new Error("HTTP error occurred.");
      }
    } catch (err) {
      console.error("Error occurred: ", err);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchNotifications();
  }, []);

  const sendPostData = async (postData) => {
    try {
      const response = await axios.post(
        "http://localhost:3500/posts/create-post",
        postData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Post data sent successfully:", response.data);
    } catch (err) {
      if (err.response) {
        console.error("Failed to send Post data. Status:", err.response.status);
      } else if (err.request) {
        console.error("No response received:", err.request);
      } else {
        console.error("Error occurred:", err.message);
      }
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("path", "");

      const response = await axios.post(
        "http://localhost:3500/minio-bucket/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // console.log("File uploaded successfully:", response.data);
      // console.log("Response data: ", response.data.filename);
      return response.data.filename;
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const post = postRef.current.value;

    const uploadedFileName = file ? await uploadFile(file) : null;

    const postData = {
      userId: userId,
      username: username,
      postDetail: post,
      filename: uploadedFileName,
      createdAt: new Date(),
    };
    // console.log("Post: ", postData);

    sendPostData(postData);

    e.target.reset();
  };

  return (
    <div>
      <NavBar />
      <div className="grid grid-cols-5">
        <div className="mx-10 mt-4 col-span-3 border-r-2 border-gray-400">
          {/* create post section */}
          <form onSubmit={handleSubmit} className="pb-4">
            <p className="pb-2 text-black text-lg font-medium">Create a post</p>
            <textarea
              name="post"
              id="post"
              className="w-[60%] p-2 h-[160px] border-2 border-blue-300 rounded-md"
              ref={postRef}
              placeholder="your question/query here"
              required
            ></textarea>
            <br />
            <input
              type="file"
              className={`mb-2 ${pasteVisible ? "hidden" : "visible"}`}
              onChange={handleFileChange}
            />

            <div className={`mt-2 ${pasteVisible ? "visible" : "hidden"}`}>
              <textarea
                name="code-snippet"
                id="code-snippet"
                className="w-[60%] p-2 h-[160px] border-2 border-blue-300 rounded-md"
                placeholder="your code snippet here"
              ></textarea>
              <div className="flex gap-2">
                <input
                  name="filename"
                  id="filename"
                  type="text"
                  placeholder="filename"
                  className="border-2 border-blue-400 rounded-md p-1"
                />
                <input
                  name="file-extension"
                  id="file-extension"
                  type="text"
                  placeholder=".ext"
                  className="border-2 border-blue-400 rounded-md p-1"
                />
              </div>
            </div>
            <div className="my-2">
              {pasteVisible ? (
                <p
                  className="text-gray-500 cursor-pointer hover:underline"
                  onClick={() => setPasteVisible(false)}
                >
                  Or, upload file from your device
                </p>
              ) : (
                <p
                  className="text-gray-500 cursor-pointer hover:underline"
                  onClick={() => setPasteVisible(true)}
                >
                  or, paste your code snippet here
                </p>
              )}
            </div>
            <input
              type="submit"
              className="px-2 py-1 bg-blue-300 text-white font-md rounded-lg hover:bg-blue-400 "
            />
          </form>
          {/* View posts section */}
          <h3 className="mt-5 mb-2 text-black text-lg font-medium border-t-2 border-gray-400 max-w-[80%] pt-4">
            Posts
          </h3>
          <div className="max-w-[90%]">
            {posts.length ? (
              posts.map((post) => <Post key={post._id} post={post} />)
            ) : (
              <h3>There is no post to view yet!</h3>
            )}
          </div>
        </div>

        {/* Notifications */}
        <div className="col-span-2">
          <h3 className="mt-5 mb-2 text-black text-lg font-medium">
            Notifications
          </h3>
          <div>
            {notifications.map((notification) => (
              <Notification
                key={notification._id}
                notification={notification}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
