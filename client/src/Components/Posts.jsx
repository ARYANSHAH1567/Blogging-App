import React, { useEffect, useState } from "react";
import PostItem from "./PostItem";
import Loader from "./Loader";
import axios from "axios";

/**
 * Posts component fetches and displays a list of posts from the server.
 * It handles loading states, errors, and displays individual posts using the PostItem component.
 *
 * @returns {JSX.Element} The rendered Posts component, or a loading/error message.
 */
const Posts = () => {
  // State to hold fetched posts, loading status, and any errors
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetches posts from the API and updates the component's state.
   * Handles loading and error states appropriately.
   *
   * @async
   */
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true); // Set loading state to true before fetching
      setError(null); // Reset error state before fetching
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts`,
        );
        const fetchedPosts = await response.data; // Get posts from API response
        setPosts(fetchedPosts); // Update posts state with fetched data
      } catch (error) {
        setError(error.message); // Set error message in case of failure
      }

      setIsLoading(false); // Set loading state to false after fetching
    };
    fetchPosts(); // Call fetchPosts function when the component mounts
  }, []); // Empty dependency array ensures it runs only once on mount

  if (isLoading) {
    return <Loader />; // Display loading indicator while data is being fetched
  }

  if (error) {
    return <h2 className="error-page">{error}</h2>; // Display error message if fetch fails
  }

  return (
    <section className="posts">
      {posts.length > 0 ? (
        <div className="container posts_container">
          {posts.map(
            ({
              _id,
              thumbnail,
              category,
              title,
              description,
              creator,
              createdAt,
            }) => {
              let id = _id.toString();
              return (
                <PostItem
                  key={id} // Unique key for each PostItem
                  postId={id}
                  thumbnail={thumbnail}
                  category={category}
                  title={title}
                  description={description}
                  creatorID={creator}
                  createdAt={createdAt}
                />
              );
            },
          )}
        </div>
      ) : (
        <h2 className="center">No posts found</h2> // Display message if no posts are found
      )}
    </section>
  );
};

export default Posts;
