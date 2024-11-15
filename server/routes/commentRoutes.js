const { Router } = require("express");
const {
  getAllComments,
  createComment,
  deleteComment,
} = require("../controllers/commentControllers");
const authMiddleware = require("../middleware/authMiddleware");

const router = Router();

/**
 * @route GET /api/comments/:id
 * @desc Get all comments for a specific post
 * @access Public
 * @param {string} id - The ID of the post to retrieve comments for.
 * @returns {Object[]} An array of comments associated with the post.
 */
router.get("/:id", getAllComments);

/**
 * @route POST /api/comments/:id
 * @desc Create a new comment on a post
 * @access Private (Requires authentication)
 * @param {string} id - The ID of the post to create a comment on.
 * @returns {Object} The newly created comment object.
 */
router.post("/:id", authMiddleware, createComment);

/**
 * @route DELETE /api/comments/:id/:commentId
 * @desc Delete a comment on a post
 * @access Private (Requires authentication)
 * @param {string} id - The ID of the post containing the comment.
 * @param {string} commentId - The ID of the comment to delete.
 * @returns {Object} A message confirming the comment has been deleted.
 */
router.delete("/:id/:commentId", authMiddleware, deleteComment);

module.exports = router;
