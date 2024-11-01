import PropTypes from "prop-types";
import Post from "./Post";

const PostsList = ({ posts }) => {
  return (
    <div>
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
  );
};

PostsList.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string,
      content: PropTypes.string,
      // Add other post properties here based on what `Post` component expects
    })
  ).isRequired,
};

export default PostsList;
