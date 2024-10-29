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
  const { userId, username, notificationsRead } = authInfo.user;

  const [title, setTitle] = useState("");
  const [extension, setExtension] = useState("");
  const [content, setContent] = useState("");

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:3500/posts/get-posts");
      if (response.status === 200) {
        const postsOfOthers = response.data.data.filter(
          (post) => post.userId !== userId
        );
        setPosts(postsOfOthers);
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
      console.log(response);
      if (response.data.success) {
        const selectedNotifications = response.data.data?.filter(
          (notification) => {
            return (
              notification.userId != userId &&
              !notificationsRead?.includes(notification._id)
            );
          }
        );
        setNotifications(selectedNotifications);
        console.log("Oise ni re? ", selectedNotifications);
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

      return response.data.filename;
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

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
      return response.data;
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

  // New function to send notification data
  const sendNotification = async (notificationData) => {
    try {
      const response = await axios.post(
        "http://localhost:3500/notifications/create-notification",
        notificationData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Notification sent successfully:", response.data);
    } catch (err) {
      console.error("Failed to send notification:", err);
    }
  };

  const handlePastedFileSubmit = async (e) => {
    e.preventDefault();

    const fileName = `${title}${extension}`;

    // Create a Blob from the content
    const blob = new Blob([content], { type: "text/plain" });

    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append("file", blob, fileName); // Append the blob with the desired filename

    // Upload the file to MinIO using the uploadFile function
    const uploadedFileName = await uploadFile(formData.get("file")); // Get the file from FormData

    const post = postRef.current.value;

    // Prepare post data
    const postData = {
      userId: userId,
      username: username,
      postDetail: post,
      filename: uploadedFileName, // This will contain the filename returned from uploadFile
      createdAt: new Date(),
    };

    // Send the post data to your backend
    const result = await sendPostData(postData);

    // Check if post was created successfully before creating notification
    if (result && result.data) {
      const notificationData = {
        username: username,
        userId: userId,
        postId: result.data._id,
        createdAt: result.data.createdAt,
      };
      await sendNotification(notificationData); // Send notification
    }

    e.target.reset();
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

    const result = await sendPostData(postData);

    // Check if post was created successfully before creating notification
    if (result && result.data) {
      const notificationData = {
        username: username,
        userId: userId,
        postId: result.data._id,
        createdAt: result.data.createdAt,
      };
      await sendNotification(notificationData); // Send notification
    }

    e.target.reset();
  };

  return (
    <div>
      <NavBar />
      <div className="grid grid-cols-5">
        <div className="mx-10 mt-4 col-span-3 border-r-2 border-gray-400">
          {/* create post section */}
          <form
            onSubmit={pasteVisible ? handlePastedFileSubmit : handleSubmit}
            className="pb-4"
          >
            <p className="mb-3 text-black text-lg font-medium">Create a post</p>
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
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
              <div className="flex gap-2">
                <input
                  name="filename"
                  id="filename"
                  type="text"
                  placeholder="filename"
                  className="border-2 border-blue-400 rounded-md p-1"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <input
                  name="file-extension"
                  id="file-extension"
                  type="text"
                  placeholder=".ext"
                  className="border-2 border-blue-400 rounded-md p-1"
                  value={extension}
                  onChange={(e) => setExtension(e.target.value)}
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
        <div className="col-span-2 mr-8">
          <h3 className="mt-5 mb-4 text-black text-lg font-medium">
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
