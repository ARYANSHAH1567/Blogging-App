const HttpError = require("../models/errorModel");
const Post = require("../models/postModel");
const { v4: uuid } = require("uuid");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const User = require("../models/userModel");
const fs = require("fs");

/**
 * Create a new post.
 * @route POST /api/posts
 * @access Protected
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.title - Title of the post
 * @param {string} req.body.description - Description of the post
 * @param {string} req.body.category - Category of the post
 * @param {Object} req.files - Uploaded files
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
const createPost = async (req, res, next) => {
  try {
    let { title, description, category } = req.body;

    if (!title || !description || !category) {
      return next(new HttpError("Please fill all the fields", 422));
    }
        const thumbnailUrl = req.file.path;
        const newPost = await Post.create({
          title,
          category,
          description,
          thumbnail: thumbnailUrl,
          creator: req.user.id,
        });
        if (!newPost) {
          return next(new HttpError("Post couldn't be created", 422));
        }

        await User.findByIdAndUpdate(req.user.id, { $inc: { posts: 1 } });

        res.status(201).json(newPost);
  } catch (error) {
    return next(new HttpError(error));
  }
};

/**
 * Get all posts.
 * @route GET /api/posts
 * @access Public
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ updatedAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

/**
 * Get a single post by ID.
 * @route GET /api/posts/:id
 * @access Public
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Post ID
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(new HttpError("Post not found", 404));
    }
    res.status(200).json(post);
  } catch (error) {
    return next(new HttpError(error));
  }
};

/**
 * Get posts by category.
 * @route GET /api/posts/categories/:category
 * @access Public
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.params.category - Post category
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
const getCatPosts = async (req, res, next) => {
  try {
    const catPosts = await Post.find({ category: req.params.category }).sort({
      updatedAt: -1,
    });
    res.status(200).json(catPosts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

/**
 * Get posts by user/author.
 * @route GET /api/posts/users/:id
 * @access Public
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.params.id - User ID
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
const getUserPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ creator: req.params.id }).sort({
      updatedAt: -1,
    });
    res.status(200).json(posts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

/**
 * Edit a post by ID.
 * @route PATCH /api/posts/:id
 * @access Protected
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body with optional fields
 * @param {Object} req.files - Uploaded files
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
const editPost = async (req, res, next) => {
  try {
    const updateFields = { ...req.body };
    const post = await Post.findById(req.params.id);

    // Check if post exists and user is authorized
    if (!post || post.creator.toString() !== req.user.id) {
      return next(new HttpError("Unauthorized or post not found", 401));
    }

    // Handle file update with Cloudinary
    if (req.file) {
      // Delete the old image from Cloudinary if it exists
      if (post.thumbnail) {
        const publicId = post.thumbnail.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`BloggingApp_DEV/${publicId}`);
      }

      // Get the new image URL from Cloudinary upload
      const thumbnailUrl = req.file.path; // `req.file.path` contains the Cloudinary URL
      updateFields.thumbnail = thumbnailUrl;
    }

    // Update the post with new fields
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    next(new HttpError(error.message || 'Something went wrong during post update.'));
  }
};

/**
 * Delete a post by ID.
 * @route DELETE /api/posts/:id
 * @access Protected
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
const deletePost = async (req, res, next) => {
  try {
    // Find the post by ID
    const post = await Post.findById(req.params.id);
    if (!post || post.creator.toString() !== req.user.id) {
      return next(new HttpError("Unauthorized or post not found", 401));
    }

    // Delete the thumbnail from Cloudinary if it exists
    if (post.thumbnail) {
      const publicId = post.thumbnail
        .split('/')
        .pop()
        .split('.')[0]; // Extract the public ID from the thumbnail URL
      await cloudinary.uploader.destroy(`BloggingApp_DEV/${publicId}`);
    }

    // Delete the post from the database
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    next(new HttpError(error.message || "Failed to delete the post"));
  }
};


module.exports = {
  createPost,
  getPosts,
  getPost,
  getCatPosts,
  getUserPosts,
  editPost,
  deletePost,
};
