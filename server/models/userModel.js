const { Schema, model } = require("mongoose");

/**
 * Mongoose schema and model for a User.
 * Represents a user in the system with associated posts and avatar.
 * @typedef {Object} User
 * @property {string} name - Name of the user (required).
 * @property {string} email - Email of the user (required).
 * @property {string} password - Password of the user (required).
 * @property {string} [avatar] - File name of the user's avatar (optional).
 * @property {number} posts - The number of posts the user has created (default is 0).
 * @property {Date} createdAt - Timestamp when the user was created (automatically generated by Mongoose).
 * @property {Date} updatedAt - Timestamp when the user was last updated (automatically generated by Mongoose).
 */
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String },
    posts: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = model("User", userSchema);
