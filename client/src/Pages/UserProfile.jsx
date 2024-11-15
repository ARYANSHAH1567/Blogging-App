import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaCheck } from "react-icons/fa";
import { UserContext } from "../context/userContext";
import axios from "axios";
import Loader from "../Components/Loader";

/**
 * The UserProfile component renders a user profile page where users can view and update
 * their details, including their avatar, name, email, and password. It provides a form
 * to update profile details and handles avatar uploads.
 *
 * @component
 * @example
 * return (
 *   <UserProfile />
 * )
 */
const UserProfile = () => {
  const { currentUser } = useContext(UserContext); // Retrieves current user data from context
  const [avatar, setAvatar] = useState(""); // Avatar URL for the user's profile picture
  const [name, setName] = useState(""); // User's name
  const [email, setEmail] = useState(""); // User's email
  const [currentPassword, setCurrentPassword] = useState(""); // Current password for updating user details
  const [newPassword, setNewPassword] = useState(""); // New password
  const [confirmNewPassword, setConfirmNewPassword] = useState(""); // Confirmed new password
  const [avatarFile, setAvatarFile] = useState(null); // To store the uploaded avatar file
  const [isAvatarTouched, setIsAvatarTouched] = useState(false); // Flag to indicate avatar change
  const [error, setError] = useState(false); // Error message state
  const [isLoading, isSetLoading] = useState(false); // Loading state for fetching data
  const [displayName, setDisplayName] = useState(""); // Display name for the profile

  /**
   * Fetches the user data from the API and sets the initial values for the profile fields.
   * If the avatar is not set, it fetches it from the API and updates the profile state.
   */
  useEffect(() => {
    const getUser = async () => {
      isSetLoading(true); // Set loading state to true while fetching user data
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/users/${currentUser.id}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          },
        );
        setAvatar(response.data.avatar); // Set avatar from the response
        setName(response.data.name);
        setDisplayName(response.data.name);
        setEmail(response.data.email);
      } catch (error) {
        setError(error.response.data.message); // Set error message if fetch fails
      }
      isSetLoading(false); // Set loading state to false once data is fetched
    };

    if (!currentUser.avatar) {
      getUser(); // Fetch user data if avatar is not set
    } else {
      setAvatar(currentUser.avatar); // Use the current user's avatar
    }
  }, [currentUser]);

  /**
   * Handles the avatar file change by uploading the file to the server and updating the avatar.
   */
  const changeAvatarHandler = async () => {
    if (!avatarFile) return; // If no avatar file selected, return early

    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/users/change-avatar`,
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        },
      );
      setAvatar(response.data.avatar); // Update avatar with the new uploaded avatar
      setIsAvatarTouched(false); // Reset avatar touched flag
    } catch (error) {
      setError(error.response.data.message); // Set error message if the avatar upload fails
    }
  };

  /**
   * Marks the avatar as touched when the user selects a new avatar.
   */
  const handleClick = async () => {
    setIsAvatarTouched(true); // Set avatar touched flag to true when user interacts with avatar input
  };

  /**
   * Handles the user profile update by sending the updated details to the server.
   * Updates the user's name, email, and password if provided.
   *
   * @param {Object} e - The form submission event object
   */
  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/users/edit-user`,
        {
          name,
          email,
          currentPassword,
          newPassword,
          confirmNewPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        },
      );
      window.location.reload(); // Reload the page to reflect the updated details
    } catch (error) {
      setError(error.response.data.message); // Set error message if the update fails
    }
  };

  if (isLoading) {
    return <Loader />; // Display a loader while data is being fetched
  }

  return (
    <section className="profile">
      <div className="container profile_container">
        <Link to={`/myposts/${currentUser.id}`} className="btn">
          My Posts
        </Link>
        <div className="profile_details">
          <div className="avatar_wrapper">
            <div className="profile_avatar">
              <img
                src={`${avatar}`}
                alt="User Avatar"
              />
            </div>
            <form className="avatar_form">
              <input
                type="file"
                name="avatar"
                id="avatar"
                onChange={(e) => setAvatarFile(e.target.files[0])}
                accept="image/png, image/jpg, image/jpeg"
              />
              <label htmlFor="avatar" onClick={handleClick}>
                <FaEdit />
              </label>
            </form>
            {isAvatarTouched && (
              <button
                className="profile_avatar-btn"
                onClick={changeAvatarHandler}
              >
                <FaCheck />
              </button>
            )}
          </div>

          <h2 style={{ textTransform: "capitalize", color: "yellow" }}>
            {displayName}
          </h2>
          <form className="form profile_form" onSubmit={handleEditUser}>
            {error && <p className="form_error-message">{error}</p>}
            <input
              type="text"
              placeholder="Name"
              value={`${name}`}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            <input
              type="email"
              placeholder="Email"
              value={`${email}`}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Current password"
              value={`${currentPassword}`}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New password"
              value={`${newPassword}`}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={`${confirmNewPassword}`}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
            <button type="submit" className="btn primary">
              Update details
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
