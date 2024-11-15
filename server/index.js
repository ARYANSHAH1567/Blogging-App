const express = require("express");
const cors = require("cors");
const { connect } = require("mongoose");
require("dotenv").config();
const upload = require("express-fileupload");

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
const port = process.env.PORT || 5000;

/**
 * Middleware to parse URL-encoded data (form submissions)
 * @name express.urlencoded
 * @param {Object} options - Options to configure URL encoding.
 * @param {boolean} options.extended - Whether to use the extended version of the query string parser.
 */
app.use(express.urlencoded({ extended: true }));

/**
 * Middleware to parse incoming JSON requests.
 * @name express.json
 * @param {Object} options - Options to configure JSON parsing.
 * @param {boolean} options.extended - Whether to use extended JSON parsing.
 */
app.use(express.json({ extended: true }));

/**
 * Middleware to enable Cross-Origin Resource Sharing (CORS).
 * @name cors
 * @param {Object} options - CORS configuration.
 * @param {boolean} options.credentials - Whether to allow credentials (cookies, HTTP authentication).
 * @param {string} options.origin - The allowed origin for requests (here it's 'http://localhost:3000').
 */
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

/**
 * Middleware to handle file uploads.
 * @name express-fileupload
 * @param {Object} options - Options to configure file upload handling.
 */
app.use(upload());

/**
 * Serve static files (such as images or documents) from the uploads directory.
 * @name express.static
 * @param {string} path - Path to the directory where uploaded files are stored.
 */
app.use("/uploads", express.static(__dirname + "/uploads"));

/**
 * Routes for user-related operations (e.g., registration, login, etc.).
 * @name userRoutes
 */
app.use("/api/users", userRoutes);

/**
 * Routes for post-related operations (e.g., creating, editing, deleting posts).
 * @name postRoutes
 */
app.use("/api/posts", postRoutes);

/**
 * Routes for comment-related operations (e.g., adding, deleting comments).
 * @name commentRoutes
 */
app.use("/api/comments", commentRoutes);

/**
 * Middleware to handle 404 errors (Page Not Found).
 * @name notFound
 */
app.use(notFound);

/**
 * Middleware to handle errors (responding with a JSON error message).
 * @name errorHandler
 * @param {Error} error - The error that needs to be handled.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {Function} next - The next middleware function.
 */
app.use(errorHandler);

/**
 * Connect to MongoDB and start the server.
 * @name connect
 * @param {string} process.env.MONGO_URI - The MongoDB connection URI from environment variables.
 * @returns {Promise} Resolves when the connection is successful, rejects on failure.
 */
connect(process.env.MONGO_URI)
  .then(
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    }),
  )
  .catch((err) => console.log(err));
