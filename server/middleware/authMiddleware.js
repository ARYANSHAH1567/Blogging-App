const jwt = require("jsonwebtoken");
const HttpError = require("../models/errorModel");

/**
 * Authentication middleware to verify JWT token.
 * @async
 * @function
 * @param {Object} req - Express request object
 * @param {Object} req.headers - Request headers
 * @param {string} req.headers.authorization - Authorization header containing the Bearer token
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 * @throws {HttpError} - If token is missing, invalid, or verification fails
 */
const authMiddleware = async (req, res, next) => {
  const Authorization = req.headers.Authorization || req.headers.authorization;

  // Check if the Authorization header exists and starts with "Bearer"
  if (Authorization && Authorization.startsWith("Bearer")) {
    const token = Authorization.split(" ")[1];

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
      if (err) {
        return next(new HttpError("Unauthorized. Invalid token", 403));
      }

      // Attach the decoded user info to the request object
      req.user = info;
      next();
    });
  } else {
    // If no token is found in the Authorization header
    return next(new HttpError("Unauthorized. No token", 401));
  }
};

module.exports = authMiddleware;
