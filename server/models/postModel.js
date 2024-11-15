const { Schema, model } = require("mongoose");

/**
 * Mongoose schema and model for a Post.
 * Represents a blog or article post created by a user.
 * @typedef {Object} Post
 * @property {string} title - Title of the post (required).
 * @property {string} description - Content or body of the post (required).
 * @property {string} thumbnail - File name of the thumbnail image (required).
 * @property {string} category - Category of the post, restricted to specific values (required).
 * @property {ObjectId} creator - Reference to the User who created the post (required).
 * @property {Array<ObjectId>} comments - Array of comment IDs associated with the post.
 * @property {Date} createdAt - Timestamp when the post was created.
 * @property {Date} updatedAt - Timestamp when the post was last updated.
 */
const postSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "Agriculture",
        "Business",
        "Education",
        "Entertainment",
        "Art",
        "Investment",
        "Uncategorized",
        "Weather",
      ],
      message: "Invalid category",
      required: true,
    },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comments",
      },
    ],
  },
  { timestamps: true },
);

module.exports = model("Post", postSchema);
