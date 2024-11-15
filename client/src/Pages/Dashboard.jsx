import React, { useState, useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../Components/Loader";
import { UserContext } from "../context/userContext";
import DeletePost from "./DeletePost";

/**
 * Dashboard component is used to display a list of posts created by a specific user.
 * It fetches posts from the server based on the user's ID passed in the URL and
 * displays them with options to view, edit, or delete each post.
 *
 * @returns {JSX.Element} A section displaying the user's posts with action buttons.
 */
const Dashboard = () => {
  // State to store posts, loading state, and error state
  const [posts, setPosts] = useState([]); // List of posts to display
  const [error, setError] = useState(null); // Error message, if any
  const [isLoading, setIsLoading] = useState(false); // Loading state for data fetching

  // Extract user ID from URL parameters
  const { id } = useParams();

  // Get the current user and token from context
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  /**
   * Fetches the posts for the user when the component mounts or when the `id` changes.
   * This effect runs when the user is logged in and the `id` in the URL is available.
   */
  useEffect(() => {
    const getPosts = async () => {
      setIsLoading(true); // Set loading to true before starting the fetch
      setError(null); // Reset error before fetching
      try {
        // Fetch posts from the server using the user's ID and authorization token
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts/users/${id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setPosts(response.data); // Set the fetched posts into state
      } catch (error) {
        setError(error.message); // If an error occurs, set the error message
      }
      setIsLoading(false); // Set loading to false after fetch completion
    };
    getPosts();
  }, [id]); // Re-run the effect if the `id` changes

  // Show loader while fetching posts
  if (isLoading) {
    return <Loader />;
  }

  // Display error message if there is an error
  if (error) {
    return <h2 className="form_error-message error-page">{error}</h2>;
  }

  return (
    <section className="dashboard">
      {/* Render posts if there are any */}
      {posts.length > 0 ? (
        <div className="container dashboard_container">
          {posts.map((post) => {
            return (
              <article key={post.id} className="dashboard_post">
                <div className="dashboard_post-info">
                  <div className="dashboard_post-thumbnail">
                    <img
                      src={`${post.thumbnail}`}
                      alt={post.title}
                    />
                  </div>
                  <h5>{post.title}</h5>
                </div>
                <div className="dashboard_post-actions">
                  {/* Link to view the post */}
                  <Link to={`/posts/${post._id}`} className="btn sm">
                    View
                  </Link>
                  {/* Link to edit the post */}
                  <Link
                    to={`/posts/${post._id}/edit`}
                    className="btn sm primary"
                  >
                    Edit
                  </Link>
                  {/* Delete post component */}
                  <DeletePost postId={post._id} />
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <h2 className="center">No posts found</h2> // Display a message if no posts
      )}
    </section>
  );
};

export default Dashboard;
