import React from "react";
import { Link } from "react-router-dom";

/**
 * Footer component for displaying category links and a copyright notice.
 *
 * @returns {JSX.Element} The rendered footer component.
 */
const Footer = () => {
  return (
    <footer>
      <ul className="footer_categories">
        <li>
          <Link to="/posts/categories/Agriculture">Agriculture</Link>
        </li>
        <li>
          <Link to="/posts/categories/Buisness">Buisness</Link>
        </li>
        <li>
          <Link to="/posts/categories/Education">Education</Link>
        </li>
        <li>
          <Link to="/posts/categories/Entertainment">Entertainment</Link>
        </li>
        <li>
          <Link to="/posts/categories/Art">Art</Link>
        </li>
        <li>
          <Link to="/posts/categories/Investment">Investment</Link>
        </li>
        <li>
          <Link to="/posts/categories/Uncategorized">Uncategorized</Link>
        </li>
        <li>
          <Link to="/posts/categories/Weather">Weather</Link>
        </li>
      </ul>
      <div className="footer_copyright">
        <small>All Rights Reserved &copy; Copyright, Aryan Shah</small>
      </div>
    </footer>
  );
};

export default Footer;
