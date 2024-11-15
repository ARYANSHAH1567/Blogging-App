/**
 * Middleware to handle unsupported (404) routes.
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Middleware to handle errors.
 * @function
 * @param {Error} error - Error object containing message and status code
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
const errorHandler = (error, req, res, next) => {
  // If headers have already been sent, delegate to the default error handler
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500).json({
    message: error.message || "An unknown error occurred",
  });
};

module.exports = { notFound, errorHandler };
