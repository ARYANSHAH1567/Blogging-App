import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import { FaBars } from "react-icons/fa";
import { useState, useContext } from "react";
import Logo from "../assets/logo.webp";
import { UserContext } from "../context/userContext";

/**
 * Header component for the navigation bar.
 * Displays different navigation menus based on the user's authentication status.
 *
 * @component
 * @returns {JSX.Element} The rendered header component.
 */
const Header = () => {
  /**
   * State to control whether the navigation menu is visible.
   * Initially set based on the window width (visible for larger screens).
   */
  const [isNavShowing, setIsNavShowing] = useState(
    window.innerWidth > 800 ? true : false,
  );

  /**
   * Access the current user's details from the `UserContext`.
   */
  const { currentUser } = useContext(UserContext);

  /**
   * Handles closing the navigation menu.
   * The menu is closed on smaller screens but remains open on larger screens.
   */
  const closeNavHandler = () => {
    if (window.innerWidth < 800) {
      setIsNavShowing(false);
    } else {
      setIsNavShowing(true);
    }
  };

  return (
    <nav>
      <div className="container nav_container">
        {/* Logo and Home Link */}
        <Link to="/" className="nav_logo" onClick={closeNavHandler}>
          <img src={Logo} alt="Navbar Logo" />
        </Link>

        {/* Menu for Authenticated Users */}
        {currentUser?.id && isNavShowing && (
          <ul className="nav_menu">
            <li>
              <Link to={`/profile/${currentUser.id}`} onClick={closeNavHandler}>
                {currentUser.name}
              </Link>
            </li>
            <li>
              <Link to="/create" onClick={closeNavHandler}>
                Create Post
              </Link>
            </li>
            <li>
              <Link to="/authors" onClick={closeNavHandler}>
                Authors
              </Link>
            </li>
            <li>
              <Link to="/logout" onClick={closeNavHandler}>
                Logout
              </Link>
            </li>
          </ul>
        )}

        {/* Menu for Unauthenticated Users */}
        {!currentUser?.id && isNavShowing && (
          <ul className="nav_menu">
            <li>
              <Link to="/authors" onClick={closeNavHandler}>
                Authors
              </Link>
            </li>
            <li>
              <Link to="/login" onClick={closeNavHandler}>
                Login
              </Link>
            </li>
          </ul>
        )}

        {/* Toggle Button for Navigation Menu */}
        <button
          className="nav_toggle-btn"
          onClick={() => setIsNavShowing(!isNavShowing)}
        >
          {isNavShowing ? <AiOutlineClose /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
};

export default Header;
