import React from "react";
import { Link } from "react-router-dom";

/**
 * ErrorPage component displays a "Page Not Found" message.
 * It includes a button to navigate back to the homepage.
 *
 * @returns {JSX.Element} A section displaying the error message and a link to the homepage.
 */
const ErrorPage = () => {
  return (
    <section className="error-page">
      <div className="center">
        {/* Link to navigate back to the home page */}
        <Link to="/" className="btn primary">
          Back To Home
        </Link>
        <h2>Page Not Found</h2>
      </div>
    </section>
  );
};

export default ErrorPage;
