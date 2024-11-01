import { useContext, useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import axios from "axios";
import { AuthContext } from "../contexts/AuthProvider";
import PostForm from "../components/PostForm";
import PostsList from "../components/PostsList";
import NotificationsList from "../components/NotificationsList";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const { authInfo } = useContext(AuthContext);
  const { userId, notificationsRead } = authInfo.user;

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
              notification.userId !== userId &&
              !notificationsRead?.includes(notification._id) && // Ensure the notification is not in the read notifications array
              !authInfo.user.readNotifications?.includes(notification._id) // Check against the readNotifications array from user document
            );
          }
        );
        setNotifications(selectedNotifications);
        console.log("Fetched notifications:", selectedNotifications);
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

  return (
    <div>
      <NavBar />
      <div className="grid grid-cols-5">
        <div className="mx-10 mt-4 col-span-3 border-r-2 border-gray-400">
          <PostForm />
          <PostsList posts={posts} />
        </div>
        <div className="col-span-2 mr-8">
          <NotificationsList notifications={notifications} />
        </div>
      </div>
    </div>
  );
};

export default Home;
