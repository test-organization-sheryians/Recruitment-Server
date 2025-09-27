// src/middlewares/role.middleware.js

/**
 * @file Role-based authorization middleware
 * @description Middleware to restrict access to routes based on user roles.
 */

import { AppError } from "../utils/errors.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Middleware to authorize users based on their role.
 *
 * @param {...string} rolesAllowed - One or more roles permitted to access the route.
 * @returns {Function} Express middleware function
 *
 * @example
 * // Only Admins can access this route
 * router.get("/admin-dashboard", authMiddleware, authorizeRoles("Admin"), (req, res) => {
 *   res.send("Welcome Admin!");
 * });
 *
 * @example
 * // Both Admins and Clients can access this route
 * router.get("/client-dashboard", authMiddleware, authorizeRoles("Admin", "Client"), (req, res) => {
 *   res.send("Welcome Admin or Client!");
 * });
 *
 * @example
 * // Only Candidates can access this route
 * router.get("/candidate-dashboard", authMiddleware, authorizeRoles("Candidate"), (req, res) => {
 *   res.send("Welcome Candidate!");
 * });
 *
 * @throws {AppError} 403 - If user role is not found or not allowed
 */
const authorizeRoles = (...rolesAllowed) => {
    return asyncHandler(async (req, res, next) => {
        if (!req.user || !req.user.role) {
            throw new AppError("User role not found", 403);
        }

        if (!rolesAllowed.includes(req.user.role)) {
            throw new AppError("You do not have permission to perform this action", 403);
        }

        next();
    });
};

export default authorizeRoles;
