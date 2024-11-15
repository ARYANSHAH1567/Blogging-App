const { Router } = require("express");
const {
  createPost,
  getPosts,
  getCatPosts,
  getUserPosts,
  getPost,
  editPost,
  deletePost,
} = require("../controllers/postControllers");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });
/**
 * @description Configures the Multer middleware for file uploads.
 * Multer is used to handle `multipart/form-data` for image uploads.
 * This configuration uses Cloudinary's storage setup to upload images directly to Cloudinary.
 * @type {multer.Multer}
 */


const router = Router();

/**
 * @route POST /api/posts
 * @desc Create a new post
 * @access Private (Requires authentication)
 * @param {string} title - The title of the post.
 * @param {string} description - The content of the post.
 * @param {string} category - The category of the post (e.g., Agriculture, Business, etc.).
 * @param {File} thumbnail - The thumbnail of image file to upload (multipart/form-data).
 * @returns {Object} The newly created post object.
 */
router.post("/", authMiddleware,  upload.single('thumbnail'), createPost);

/**
 * @route GET /api/posts
 * @desc Get all posts
 * @access Public
 * @returns {Object[]} An array of all posts.
 */
router.get("/", getPosts);

/**
 * @route GET /api/posts/:id
 * @desc Get a specific post by its ID
 * @access Public
 * @param {string} id - The ID of the post to retrieve.
 * @returns {Object} The post with the specified ID.
 */
router.get("/:id", getPost);

/**
 * @route PATCH /api/posts/:id
 * @desc Edit a specific post
 * @access Private (Requires authentication)
 * @param {string} id - The ID of the post to edit.
 * @param {string} title - The updated title of the post.
 * @param {string} description - The updated description of the post.
 * @param {string} category - The updated category of the post.
 * @param {File} thumbnail - The thumbnail of image file to upload (multipart/form-data).
 * @returns {Object} The updated post object.
 */
router.patch("/:id", authMiddleware,upload.single('thumbnail'),editPost);

/**
 * @route GET /api/posts/categories/:category
 * @desc Get posts by category
 * @access Public
 * @param {string} category - The category to filter posts by (e.g., Business, Education).
 * @returns {Object[]} An array of posts in the specified category.
 */
router.get("/categories/:category", getCatPosts);

/**
 * @route GET /api/posts/users/:id
 * @desc Get posts created by a specific user
 * @access Public
 * @param {string} id - The ID of the user to retrieve posts for.
 * @returns {Object[]} An array of posts created by the specified user.
 */
router.get("/users/:id", getUserPosts);

/**
 * @route DELETE /api/posts/:id
 * @desc Delete a specific post
 * @access Private (Requires authentication)
 * @param {string} id - The ID of the post to delete.
 * @returns {Object} A message confirming the post has been deleted.
 */
router.delete("/:id", authMiddleware, deletePost);

module.exports = router;
