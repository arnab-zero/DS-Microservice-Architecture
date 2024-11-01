import axios from "axios";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../contexts/AuthProvider";

const PostForm = () => {
  const [pasteVisible, setPasteVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [extension, setExtension] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);

  const postRef = useRef();

  const { authInfo } = useContext(AuthContext);
  const { userId, username } = authInfo.user;

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
              className="text-gray-500 cursor-pointer hover:underline w-fit"
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
    </div>
  );
};

export default PostForm;
