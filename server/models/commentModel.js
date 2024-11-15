const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Mongoose Schema for a Comment.
 * @typedef {Object} Comment
 * @property {string} comment - The content of the comment.
 * @property {Date} createdAt - The date when the comment was created. Defaults to the current date.
 * @property {mongoose.Types.ObjectId} creator - The ID of the user who created the comment. References the User model.
 * @property {Date} createdAt - Timestamp for comment creation, automatically set by Mongoose.
 * @property {Date} updatedAt - Timestamp for the last comment update, automatically set by Mongoose.
 */
const comSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }, // Enable automatic `createdAt` and `updatedAt` fields
);

/**
 * Mongoose model for comments.
 * @type {mongoose.Model<Comment>}
 */
const Comments = mongoose.model("Comments", comSchema);

module.exports = Comments;
