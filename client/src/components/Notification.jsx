import { useContext, useState } from "react";
import PropTypes from "prop-types";
import Post from "./Post";
import axios from "axios";
import { AuthContext } from "../contexts/AuthProvider";

const Notification = ({ notification }) => {
  const { username, createdAt, postId, _id: notificationId } = notification; // Added notification ID
  const [showPopup, setShowPopup] = useState(false);
  const [postDetails, setPostDetails] = useState(null);
  const { authInfo, setAuthInfo } = useContext(AuthContext);
  const { userId } = authInfo;

  // console.log("User id:", authInfo.user.userId);

  const handleViewClick = async () => {
    try {
      const response = await fetch(`http://localhost:3500/posts/${postId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch post details");
      }
      const data = await response.json();
      setPostDetails(data);
      setShowPopup(true);
    } catch (error) {
      console.error("Error fetching post details:", error);
    }
  };

  // Updated handleMarkAsRead to properly send notificationId
  const handleMarkAsRead = async () => {
    try {
      // Prepare the payload to include notificationId
      const response = await axios.put(
        `http://localhost:3500/users/${authInfo.user.userId}`, // Updated endpoint to include notifications
        { notificationId } // Send notificationId as part of the request body
      );

      console.log("Updated user notifications:", response.data);
    } catch (error) {
      console.error("Error updating user notifications:", error);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setPostDetails(null);
  };

  return (
    <div className="p-2 border-2 border-gray-400 bg-slate-200 rounded-md mb-3">
      <span className="font-semibold">{username}</span> created a post at{" "}
      {createdAt}.{" "}
      <span
        className="hover:underline cursor-pointer hover:text-blue-400"
        onClick={handleViewClick}
      >
        View it.
      </span>
      <div
        className="font-light hover:underline cursor-pointer py-1"
        onClick={handleMarkAsRead} // Updated to call handleMarkAsRead directly
      >
        Mark as read
      </div>
      {showPopup && postDetails && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg w-96">
            <Post post={postDetails} />
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={closePopup}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

Notification.propTypes = {
  notification: PropTypes.shape({
    username: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    _id: PropTypes.string.isRequired, // Added notification ID prop type
  }).isRequired,
};

export default Notification;
