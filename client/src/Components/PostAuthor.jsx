import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en.json";
import ru from "javascript-time-ago/locale/ru.json";

// Add locales for time ago formatting
TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

/**
 * PostAuthor component to display the author of a post.
 * Fetches author data and displays the author's avatar, name, and the time since the post was created.
 *
 * @param {Object} props - The component props.
 * @param {string} props.creatorID - The ID of the post creator.
 * @param {string} props.createdAt - The creation timestamp of the post.
 * @returns {JSX.Element} The rendered PostAuthor component.
 */
const PostAuthor = ({ creatorID, createdAt }) => {
  // State to hold the author data and any error message
  const [author, setAuthor] = useState({});
  const [error, setError] = useState(null);

  /**
   * Fetches the author details based on the creatorID passed in props.
   * Sets the author data in state or an error message if the request fails.
   */
  useEffect(() => {
    const getAuthor = async () => {
      setError(null); // Reset error state before fetching
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/users/${creatorID}`,
        );
        const author = await response.data;
        setAuthor(author);
      } catch (error) {
        setError(error.response.data.message); // Set error if API call fails
      }
    };
    getAuthor();
  }, [creatorID]); // Dependency on creatorID to refetch if it changes

  // If an error occurs, display the error message
  if (error) return <p className="error-page">{error}</p>;

  return (
    <Link to={`/posts/users/${creatorID}`} className="post_author">
      <div className="post_author-avatar">
        <img
          src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${author.avatar}`}
          alt={`${author.name}'s avatar`}
        />
      </div>
      <div className="post_author-details">
        <h5>By: {author.name}</h5>
        <small>
          <ReactTimeAgo date={new Date(createdAt)} locale="en-US" />
        </small>
      </div>
    </Link>
  );
};

export default PostAuthor;
