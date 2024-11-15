import { createContext, useEffect, useState } from "react";

// Create a Context for user data
export const UserContext = createContext();

/**
 * UserProvider component provides user-related state and functions to the component tree.
 * It manages the current user data and loading state, storing user data in localStorage.
 *
 * @param {Object} props - The component's props.
 * @param {JSX.Element} props.children - The child components that will have access to the user context.
 *
 * @returns {JSX.Element} A provider component that wraps its children with the UserContext.
 */
const UserProvider = ({ children }) => {
  // State to hold the current user object, initialized from localStorage if available
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // State to track the loading state
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Effect to load user data from localStorage when the component mounts.
   * Once the data is loaded, it sets the loading state to false.
   */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser)); // Update the current user state
    }
    setIsLoading(false); // Set loading to false after initialization
  }, []); // Empty dependency array means this effect runs once when the component mounts

  return (
    // Provide currentUser, setCurrentUser, and isLoading to the component tree
    <UserContext.Provider value={{ currentUser, setCurrentUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
