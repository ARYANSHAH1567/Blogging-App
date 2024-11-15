const HttpError = require("../models/errorModel");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const Comments = require("../models/commentModel");

/**
 * Get all comments for a specific post.
 * @route GET /api/comments/:id
 * @access Public
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - ID of the post
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
const getAllComments = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate({
      path: "comments",
      populate: {
        path: "creator", // Populate the 'creator' field inside each comment
        model: "User", // Specify the model to populate
      },
    });

    if (!post) {
      return next(new HttpError("Post not found", 404));
    }

    const comments = post.comments;
    res.status(200).json(comments);
  } catch (error) {
    return next(new HttpError(error));
  }
};

/**
 * Create a new comment for a specific post.
 * @route POST /api/comments/:id
 * @access Protected
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - ID of the post
 * @param {Object} req.body - Request body
 * @param {string} req.body.text - Text content of the comment
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.user.id - ID of the currently logged-in user
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
const createComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || text === "") {
      return next(new HttpError("Please enter a comment", 422));
    }

    const post = await Post.findById(id);
    if (!post) {
      return next(new HttpError("Post not found", 404));
    }

    const newComment = await Comments.create({
      comment: text,
      creator: req.user.id,
    });

    if (!newComment) {
      return next(new HttpError("Comment couldn't be created", 422));
    }

    post.comments.push(newComment._id);
    await post.save();
    res.status(201).json(newComment);
  } catch (error) {
    return next(new HttpError(error));
  }
};

/**
 * Delete a comment from a specific post.
 * @route DELETE /api/comments/:id/:commentId
 * @access Protected
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - ID of the post
 * @param {string} req.params.commentId - ID of the comment to delete
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.user.id - ID of the currently logged-in user
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
const deleteComment = async (req, res, next) => {
  try {
    const { id, commentId } = req.params;

    // Check if the user is authorized to delete the comment
    if (req.user.id !== commentId) {
      return next(
        new HttpError("You are not authorized to delete this comment", 401),
      );
    }

    const post = await Post.findById(id);
    if (!post) {
      return next(new HttpError("Post not found", 404));
    }

    // Remove the comment from the post's comments array
    await Post.findByIdAndUpdate(id, { $pull: { comments: commentId } });

    // Delete the comment from the database
    const comment = await Comments.findByIdAndDelete(commentId);
    if (!comment) {
      return next(new HttpError("Comment not found", 404));
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    return next(new HttpError(error));
  }
};

module.exports = { getAllComments, createComment, deleteComment };
