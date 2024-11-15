import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/userContext";
import axios from "axios";
import Loader from "../Components/Loader";

/**
 * DeletePost component allows users to delete a post.
 * It handles the post deletion process by making an API call to the server.
 *
 * @param {Object} props - The component props.
 * @param {string} props.postId - The ID of the post to delete.
 *
 * @returns {JSX.Element} A link that triggers the post deletion process.
 */
const DeletePost = ({ postId: id }) => {
  const [isLoading, setIsLoading] = useState(false); // Loading state during post deletion
  const [error, setError] = useState(null); // Error state for storing error messages
  const navigate = useNavigate(); // Navigation hook to redirect after deletion

  // Retrieve current user's token from context
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  // If the component is loading, show a loader
  if (isLoading) {
    return <Loader />;
  }

  /**
   * removePost deletes the post with the given ID by sending a DELETE request to the API.
   *
   * @param {string} id - The ID of the post to be deleted.
   */
  const removePost = async (id) => {
    setIsLoading(true); // Set loading state to true
    setError(null); // Reset error state before making the request
    try {
      // Send DELETE request to remove the post
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/"); // Redirect to homepage after deletion
    } catch (error) {
      setError(error.response.data.message); // Set error message if the request fails
    }
    setIsLoading(false); // Set loading state to false after the request
  };

  // Display error message if an error occurred
  if (error) {
    return <div className="form_error-page">{error}</div>;
  }

  // Render a button to trigger the deletion
  return (
    <Link className="btn sm danger" onClick={() => removePost(id)}>
      {" "}
      Delete
    </Link>
  );
};

export default DeletePost;
