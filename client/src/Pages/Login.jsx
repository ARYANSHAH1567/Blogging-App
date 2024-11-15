import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/userContext";

/**
 * Login component allows users to sign in with their email and password.
 * If login is successful, the user data is stored in the context and redirects to the home page.
 *
 * @returns {JSX.Element} A login form with inputs for email and password.
 */
const Login = () => {
  // State for storing email and password input values
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(""); // State to hold error messages
  const navigate = useNavigate(); // Hook for navigation

  const { setCurrentUser } = useContext(UserContext); // UserContext to set logged-in user

  /**
   * Handles changes to form inputs.
   *
   * @param {Object} e - Event object for form inputs.
   */
  const changeInputHandler = (e) => {
    setUserData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  /**
   * Handles the user login by sending a POST request with the email and password.
   * If successful, sets the current user in the context and navigates to the home page.
   *
   * @param {Object} e - The form submit event.
   */
  const loginUser = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/users/login`,
        userData,
      );
      const loggedUser = await response.data; // Get logged-in user data
      setCurrentUser(loggedUser); // Update context with logged-in user
      localStorage.setItem("user", JSON.stringify(loggedUser)); // Store user data in localStorage
      navigate("/"); // Redirect to home page
    } catch (error) {
      setError(error.response.data.message); // Set error if login fails
    }
  };

  return (
    <section className="login">
      <div className="container">
        <h2> Sign In </h2>
        <form className="form login_form" onSubmit={loginUser}>
          {error && <p className="form_error-message">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={userData.email}
            onChange={changeInputHandler}
            autoFocus
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={userData.password}
            onChange={changeInputHandler}
          />
          <button type="submit" className="btn primary">
            Sign in
          </button>
        </form>
        <small>
          Don't have an account? <Link to="/register">Sign up</Link>
        </small>
      </div>
    </section>
  );
};

export default Login;
