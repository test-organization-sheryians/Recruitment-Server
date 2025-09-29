// src/utils/asyncHandler.js
// A utility function to wrap async Express route handlers (controllers)
// This prevents having to write try/catch blocks in every controller method.

/**
 * Wraps an async controller function to catch errors and pass them to Express's error middleware.
 * @param {Function} fn The asynchronous function to wrap (controller method)
 * @returns {Function} A new function that executes the controller and handles errors.
 */
const asyncHandler = (fn) => (req, res, next) => {
  // Promise.resolve() ensures that if 'fn' returns a value instead of a promise, 
  // it's still treated as a promise, allowing .catch to be chained.
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
