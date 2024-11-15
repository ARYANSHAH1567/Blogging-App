import React, { useState, useEffect } from "react";
import PostItem from "../Components/PostItem";
import Loader from "../Components/Loader";
import axios from "axios";
import { useParams } from "react-router-dom";

/**
 * CategoryPosts component fetches and displays a list of posts based on a specific category.
 * It uses the `category` from URL params to fetch posts related to that category.
 * If loading or an error occurs, appropriate feedback is shown.
 *
 * @returns {JSX.Element} A component that displays posts of a specific category.
 */
const CategoryPosts = () => {
  // State to hold the list of posts fetched from the API
  const [posts, setPosts] = useState([]);

  // State to track if the data is still being loaded
  const [isLoading, setIsLoading] = useState(false);

  // State to hold any errors that occur during the fetch
  const [error, setError] = useState(null);

  // Get the category from the URL params
  const { category } = useParams();

  /**
   * useEffect hook to fetch posts based on category when the component mounts or category changes.
   */
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true); // Start loading
      setError(null); // Reset error state before fetching

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts/categories/${category}`,
        );
        const fetchedPosts = await response.data;
        setPosts(fetchedPosts); // Set posts to the fetched data
      } catch (error) {
        setError(error.message); // Set error state in case of failure
      }

      setIsLoading(false); // End loading
    };
    fetchPosts(); // Call the fetchPosts function
  }, [category]); // Dependency on category to refetch when category changes

  // If data is still loading, display the loader
  if (isLoading) {
    return <Loader />;
  }

  // If there was an error, display the error message
  if (error) {
    return <h2 className="error-page">{error}</h2>;
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
                  key={id}
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
        <h2 className="center">No posts found</h2>
      )}
    </section>
  );
};

export default CategoryPosts;
