import PropTypes from "prop-types";
import axios from "axios";
import { useState } from "react";

const Post = ({ post }) => {
  const { createdAt, filename, postDetail, username } = post;
  const [fileContent, setFileContent] = useState(null);

  const downloadFile = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3500/minio-bucket/download/${filename}`,
        {
          responseType: "blob", // This allows you to download the file as a Blob
        }
      );

      // Create a URL for the Blob and initiate download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${filename}`); // Set the download filename
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  const getFileContent = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3500/minio-bucket/download/${filename}`
      );
      setFileContent(response.data);
      // console.log("Content: ", response.data);
    } catch (err) {
      console.error("Error occurred: ", err);
    }
  };

  getFileContent();

  return (
    <div className="px-4 py-2 mb-4 border-[2px] border-gray-300 rounded-md">
      <h1>
        Posted by <span className="font-medium">{username}</span>
      </h1>
      <p className="pb-2 border-b-2 border-gray-300">at {createdAt}</p>
      <div className="text-justify my-2">{postDetail}</div>
      <div className="mb-4">
        {fileContent ? (
          <div>
            {/* <div className="mb-2">Attached file content:</div> */}
            <div className="text-source-code bg-black text-red-600 text-sm p-2 rounded-md">{`${fileContent}`}</div>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div
        className="bg-blue-400 w-fit p-1 text-xs text-white rounded-md cursor-pointer"
        onClick={() => downloadFile()}
      >
        Download File
      </div>
    </div>
  );
};

Post.propTypes = {
  post: PropTypes.shape({
    createdAt: PropTypes.string.isRequired,
    filename: PropTypes.string,
    postDetail: PropTypes.string.isRequired,
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
};

export default Post;
