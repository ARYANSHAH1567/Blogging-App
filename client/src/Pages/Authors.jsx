import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "../Components/Loader";

/**
 * Authors component fetches and displays a list of authors.
 * It fetches authors data and shows their avatars, names, and the number of posts they've authored.
 * If loading or an error occurs, appropriate feedback is shown.
 *
 * @returns {JSX.Element} A component that displays a list of authors.
 */
const Authors = () => {
  // State to hold the list of authors fetched from the API
  const [authors, setAuthors] = useState([]);

  // State to track if the data is still being loaded
  const [isLoading, setIsLoading] = useState(false);

  // State to hold any errors that occur during the fetch
  const [error, setError] = useState(null);

  /**
   * useEffect hook to fetch authors' data when the component mounts.
   */
  useEffect(() => {
    const fetchAuthors = async () => {
      setIsLoading(true); // Start loading
      setError(null); // Reset error state before fetching

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/users/authors`,
        );
        const fetchedAuthors = await response.data;
        setAuthors(fetchedAuthors); // Set authors to the fetched data
      } catch (error) {
        setError(error.message); // Set error state in case of failure
      }

      setIsLoading(false); // End loading
    };
    fetchAuthors(); // Call the fetchAuthors function
  }, []); // Run only once when the component mounts

  // If data is still loading, display the loader
  if (isLoading) {
    return <Loader />;
  }

  // If there was an error, display the error message
  if (error) {
    return <h2 className="error-page">{error}</h2>;
  }

  return (
    <section className="authors">
      {authors.length > 0 ? (
        <div className="container authors_container">
          {authors.map(({ _id: id, avatar, name, posts }) => {
            return (
              <Link key={id} to={`/posts/users/${id}`} className="author">
                <div className="author_avatar">
                  <img
                    src={`${avatar}`}
                    alt={`${name}`}
                  />
                </div>
                <div className="author_info">
                  <h4>{name}</h4>
                  <p>{posts} </p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <h2 className="center">No authors found</h2>
      )}
    </section>
  );
};

export default Authors;
