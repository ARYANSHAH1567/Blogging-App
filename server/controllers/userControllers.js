const User = require("../models/userModel");
const HttpError = require("../models/errorModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const cloudinary = require("cloudinary").v2;

/**
 * Register a new user.
 * @route POST /api/users/register
 * @access Public
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.name - User's name
 * @param {string} req.body.email - User's email
 * @param {string} req.body.password - User's password
 * @param {string} req.body.confirmPassword - User's confirm password
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password || !confirmPassword) {
      return next(new HttpError("Fill in all the fields", 422));
    }
    const newEmail = email.toLowerCase();
    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists) return next(new HttpError("Email already exists", 422));

    if (password.trim().length < 6) {
      return next(
        new HttpError("Password should be at least 6 characters.", 422),
      );
    }
    if (password !== confirmPassword) {
      return next(new HttpError("Passwords do not match", 422));
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email: newEmail,
      password: hashedPass,
    });
    res.status(201).json(`new user ${newUser.email} registered`);
  } catch (error) {
    return next(new HttpError("User registration Failed", 422));
  }
};

/**
 * Log in a user.
 * @route POST /api/users/login
 * @access Public
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - User's email
 * @param {string} req.body.password - User's password
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return next(new HttpError("Please fill in all the fields", 422));

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new HttpError("Invalid credentials", 422));
    }

    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    res.status(200).json({ id: user._id, name: user.name, token });
  } catch (error) {
    return next(
      new HttpError("Login failed. Please check your credentials", 422),
    );
  }
};

/**
 * Get user profile by ID.
 * @route GET /api/users/:id
 * @access Protected
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.params.id - User ID
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return next(new HttpError("User Not Found", 404));
    res.status(200).json(user);
  } catch (error) {
    return next(new HttpError(error));
  }
};

/**
 * Change user avatar.
 * @route POST /api/users/change-avatar
 * @access Protected
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.files - Uploaded files
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
const changeAvatar = async (req, res, next) => {
  try {
    // Check if the file is uploaded and has a valid size
    if (!req.file || req.file.size > 500000) {
      return next(new HttpError("Please choose an image less than 500KB", 422));
    }

    const userId = req.user.id;
    const user = await User.findById(userId);

    // Delete the existing avatar from Cloudinary if it exists
    if (user.avatar) {
      const publicId = user.avatar.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`BloggingApp_DEV/${publicId}`);
    }

    // Get the new image URL from the uploaded file
    const avatarUrl = req.file.path; // Cloudinary URL provided by Multer

    // Update the user's avatar in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarUrl },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    return next(new HttpError(error.message || "Failed to update avatar"));
  }
};


/**
 * Edit user details.
 * @route POST /api/users/edit-user
 * @access Protected
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
const edituser = async (req, res, next) => {
  try {
    const { name, email, currentPassword, newPassword, confirmNewPassword } =
      req.body;
    const user = await User.findById(req.user.id);
    if (!user) return next(new HttpError("User not found", 404));

    const updateFields = {};
    if (email && email !== user.email) {
      const emailExist = await User.findOne({ email });
      if (emailExist) return next(new HttpError("Email already exists", 422));
      updateFields.email = email;
    }

    if (currentPassword && newPassword && newPassword === confirmNewPassword) {
      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) return next(new HttpError("Invalid current password", 422));
      updateFields.password = await bcrypt.hash(newPassword, 10);
    }

    if (name) updateFields.name = name;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateFields,
      { new: true },
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    return next(new HttpError(error));
  }
};

/**
 * Get all authors.
 * @route GET /api/users/authors
 * @access Public
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
const getAuthors = async (req, res, next) => {
  try {
    const authors = await User.find().select("-password");
    res.status(200).json(authors);
  } catch (error) {
    return next(new HttpError(error));
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  changeAvatar,
  edituser,
  getAuthors,
};
