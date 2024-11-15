import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/**
 * The Register component renders a registration form where users can sign up.
 * It handles user input, form submission, and error handling for registration.
 *
 * @component
 * @example
 * return (
 *   <Register />
 * )
 */
const Register = () => {
  const [userData, setUserData] = useState({
    name: "", // The user's name
    email: "", // The user's email address
    password: "", // The user's password
    confirmPassword: "", // The user's password confirmation
  });

  const [error, setError] = useState(""); // State to handle any errors
  const navigate = useNavigate(); // Hook to navigate the user after successful registration

  /**
   * Updates the user data state when an input field is changed.
   *
   * @param {Object} e - The event object containing input field details
   */
  const changeInputHandler = (e) => {
    setUserData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  /**
   * Handles form submission for user registration.
   * Sends the user data to the server and redirects to the login page upon success.
   * Displays an error message if the registration fails.
   *
   * @param {Object} e - The form submission event object
   */
  const registerUser = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors before new submission
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/users/register`,
        userData,
      );
      const newUser = await response.data;
      navigate("/login"); // Redirect to login page upon successful registration
    } catch (error) {
      setError(error.response.data.message); // Set error message if registration fails
    }
  };

  return (
    <section className="register">
      <div className="container">
        <h2> Sign Up </h2>
        <form className="form register_form" onSubmit={registerUser}>
          {error && <p className="form_error-message">{error}</p>}
          <input
            type="text"
            placeholder="Full Name"
            name="name"
            value={userData.name}
            onChange={changeInputHandler}
            autoFocus
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={userData.email}
            onChange={changeInputHandler}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={userData.password}
            onChange={changeInputHandler}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={userData.confirmPassword}
            onChange={changeInputHandler}
          />
          <button type="submit" className="btn primary">
            Register
          </button>
        </form>
        <small>
          {" "}
          Already have an account? <Link to="/login">Sign in </Link>{" "}
        </small>
      </div>
    </section>
  );
};

export default Register;
