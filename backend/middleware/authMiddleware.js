const Owner = require('../models/ownerModel')
const Employee = require('../models/employeeModel')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const JWT_TOKEN = process.env.JWT_TOKEN;

const protect = asyncHandler(async (req, res, next) => {

    const token = req.cookies?.token

    if (!token) {
        return res.status(401).json({
            message: "Not authorized. No token provided."
        });
    }

    try {

        // Verify token
        const decoded = jwt.verify(
            token,
            JWT_TOKEN
        );

        let user;

        // Find authenticated user
        if (decoded.role === "owner") {

            user = await Owner.findById(decoded.id);

        } else {

            user = await Employee.findById(decoded.id);

        }

        if (!user) {
            return res.status(401).json({
                message: "User not found."
            });
        }

        // Attach authenticated user
        req.user = user;

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired token."
        });

    }

});


const authorize = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    next();
  });


  module.exports = {
    protect, 
    authorize
  }