import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { Navigate, useLocation } from "react-router-dom";

/**
 * ProtectedRoute component protects certain routes by checking if the user is authenticated.
 * If the user is not authenticated, they are redirected to the login page.
 *
 * @param {Object} props - The component's props.
 * @param {JSX.Element} props.children - The child components that will be rendered if the user is authenticated.
 *
 * @returns {JSX.Element|null} The child components if authenticated, or a redirect to the login page if not.
 */
const ProtectedRoute = ({ children }) => {
  // Access current user and loading state from the context
  const { currentUser, isLoading } = useContext(UserContext);
  const token = currentUser?.token; // Check if user has a token
  const location = useLocation(); // Get the current location (for redirecting after login)

  // Wait for user data to load before making any redirection decisions
  if (isLoading) {
    return null; // Optionally, display a loading spinner here
  }

  // Redirect to login page if the user is not authenticated
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the child components
  return children;
};

export default ProtectedRoute;
