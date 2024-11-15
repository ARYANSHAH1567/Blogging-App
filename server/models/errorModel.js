/**
 * Custom Error class for handling HTTP errors.
 * @extends Error
 */
class HttpError extends Error {
  /**
   * Creates an instance of HttpError.
   * @param {string} message - The error message to be shown.
   * @param {number} errorCode - The HTTP status code associated with the error.
   */
  constructor(message, errorCode) {
    super(message); // Pass the message to the parent Error class
    this.code = errorCode; // Custom property for HTTP status code
  }
}

module.exports = HttpError;
