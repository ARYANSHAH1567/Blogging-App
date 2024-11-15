import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

/**
 * Logout component handles logging out the user by clearing the user data in context
 * and redirects them to the login page.
 *
 * @returns {JSX.Element} An empty element since the component performs an immediate action and redirects.
 */
const Logout = () => {
  const { setCurrentUser } = useContext(UserContext); // Accessing the context to update current user
  const navigate = useNavigate(); // Hook for navigation

  // Clear user data from context and localStorage
  setCurrentUser(null);
  localStorage.removeItem("user"); // Remove user data from localStorage

  // Redirect to login page
  navigate("/login");

  return <></>; // Empty JSX as this component doesn't render anything visible
};

export default Logout;
