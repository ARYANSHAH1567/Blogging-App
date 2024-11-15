const { Router } = require("express");
const {
  registerUser,
  loginUser,
  getUser,
  changeAvatar,
  edituser,
  getAuthors,
} = require("../controllers/userControllers");
const authMiddleware = require("../middleware/authMiddleware");
const router = Router();

/**
 * @route POST /api/users/register
 * @desc Register a new user
 * @access Public
 * @param {string} name - The name of the user.
 * @param {string} email - The email of the user.
 * @param {string} password - The password for the user.
 * @param {string} confirmPassword - Confirmation of the password.
 * @returns {string} A success message upon successful registration.
 */
router.post("/register", registerUser);

/**
 * @route POST /api/users/login
 * @desc Log in an existing user
 * @access Public
 * @param {string} email - The email of the user.
 * @param {string} password - The password for the user.
 * @returns {Object} The user's ID, name, and JWT token for authentication.
 */
router.post("/login", loginUser);

/**
 * @route POST /api/users/change-avatar
 * @desc Change the avatar of the logged-in user
 * @access Private (Requires authentication)
 * @param {File} avatar - The new avatar image to upload.
 * @returns {Object} The updated user object with the new avatar.
 */
router.post("/change-avatar", authMiddleware, changeAvatar);

/**
 * @route PATCH /api/users/edit-user
 * @desc Edit user details (name, email, password)
 * @access Private (Requires authentication)
 * @param {string} name - The new name of the user (optional).
 * @param {string} email - The new email of the user (optional).
 * @param {string} currentPassword - The current password for verification (if changing password).
 * @param {string} newPassword - The new password (if updating).
 * @param {string} confirmNewPassword - Confirmation of the new password.
 * @returns {Object} The updated user object.
 */
router.patch("/edit-user", authMiddleware, edituser);

/**
 * @route GET /api/users/authors
 * @desc Get all authors (users)
 * @access Public
 * @returns {Object[]} An array of all users (authors) in the system.
 */
router.get("/authors", getAuthors);

/**
 * @route POST /api/users/:id
 * @desc Get a specific user's profile by ID
 * @access Public
 * @param {string} id - The ID of the user to retrieve.
 * @returns {Object} The user object with the specified ID.
 */
router.post("/:id", getUser);

module.exports = router;
