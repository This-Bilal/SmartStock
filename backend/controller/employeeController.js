const Owner = require("../models/ownerModel");
const Employee = require("../models/employeeModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_TOKEN = process.env.JWT_TOKEN;
const { checkPlanLimit } = require("../services/subscriptionService");

const createEmployee = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({
      message: "All fields are required.",
    });
  }

  if (!["manager", "cashier"].includes(role)) {
    return res.status(400).json({
      message: "Invalid employee role.",
    });
  }

  const employeeEmail = email.trim().toLowerCase();

  const existingEmployee = await Employee.findOne({
    email: employeeEmail,
  });

  if (existingEmployee) {
    return res.status(400).json({
      message: "This email already exists.",
    });
  }

  // Check the owner's employee limit
  const currentEmployees = await Employee.countDocuments({
    owner: req.user._id,
  });

  const limitCheck = await checkPlanLimit(
    req.user,
    "maxEmployees",
    currentEmployees,
  );

  if (!limitCheck.allowed) {
    return res.status(403).json({
      message: `Your ${limitCheck.plan} plan allows a maximum of ${limitCheck.limit} employees.`,
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const employee = await Employee.create({
    owner: req.user._id,
    name,
    email: employeeEmail,
    password: hashedPassword,
    role,
  });

  return res.status(201).json({
    _id: employee._id,
    name: employee.name,
    email: employee.email,
    role: employee.role,
    isActive: employee.isActive,
    owner: employee.owner,
  });
});

const loginEmployee = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required.",
    });
  }

  const employeeEmail = email.trim().toLowerCase();

  const employee = await Employee.findOne({ email: employeeEmail }).select(
    "+password",
  );

  if (!employee) {
    return res.status(401).json({
      message: "Invalid email or password.",
    });
  }

  const isMatch = await bcrypt.compare(password, employee.password);

  if (!isMatch) {
    return res.status(401).json({
      message: "Invalid email or password.",
    });
  }

  if (!employee.isActive) {
    return res.status(403).json({
      message:
        "Your account has been deactivated. Please contact your employer.",
    });
  }

  const token = jwt.sign(
    {
      id: employee._id,
      owner: employee.owner,
      role: employee.role,
    },
    JWT_TOKEN,
    {
      expiresIn: "1d",
    },
  );

  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), //24hrs
    sameSite: "none",
    secure: true,
  });

  return res.status(200).json({
    _id: employee._id,
    owner: employee.owner,
    name: employee.name,
    email: employee.email,
    role: employee.role,
    isActive: employee.isActive,
    token,
  });
});

const logoutEmployee = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });

  res.status(200).json({
    message: "Employee logged out successfully.",
  });
});

const getAllEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find({ owner: req.user._id })
    .select("-password")
    .sort({ createdAt: -1 });

  return res.status(200).json(employees);
});

const getSingleEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const ownerId = req.user.role === "owner" ? req.user._id : req.user.owner;
  const employee = await Employee.findOne({
    _id: id,
    owner: ownerId,
  }).select("-password");

  if (!employee) {
    return res.status(404).json({
      message: "Employee not found.",
    });
  }

  return res.status(200).json(employee);
});

const updateEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  // Find employee belonging to the logged-in owner
  const employee = await Employee.findOne({
    _id: id,
    owner: req.user._id,
  });

  if (!employee) {
    return res.status(404).json({
      message: "Employee not found.",
    });
  }

  // Check if at least one field was provided
  if (name === undefined && email === undefined && role === undefined) {
    return res.status(400).json({
      message: "No changes provided.",
    });
  }

  let hasChanges = false;

  if (name !== undefined) {
    if (!name.trim()) {
      return res.status(400).json({
        message: "Name cannot be empty.",
      });
    }

    const normalisedName = name.trim();

    if (normalisedName !== employee.name) {
      employee.name = normalisedName;
      hasChanges = true;
    }
  }

  if (email !== undefined) {
    if (!email.trim()) {
      return res.status(400).json({
        message: "Email cannot be empty.",
      });
    }

    const normalisedEmail = email.trim().toLowerCase();

    // Only check for another employee if email is actually changing
    if (normalisedEmail !== employee.email) {
      const existingEmployee = await Employee.findOne({
        owner: req.user._id,
        email: normalisedEmail,
        _id: { $ne: employee._id },
      });

      if (existingEmployee) {
        return res.status(400).json({
          message: "Employee with this email already exists.",
        });
      }

      employee.email = normalisedEmail;
      hasChanges = true;
    }
  }

  if (role !== undefined) {
    if (!["manager", "cashier"].includes(role)) {
      return res.status(400).json({
        message: "Invalid employee role.",
      });
    }

    if (role !== employee.role) {
      employee.role = role;
      hasChanges = true;
    }
  }

  // No actual changes were made
  if (!hasChanges) {
    return res.status(400).json({
      message: "No changes were made.",
    });
  }

  const updatedEmployee = await employee.save();

  res.status(200).json(updatedEmployee);
});

const toggleEmployeeStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const ownerId = req.user.role === "owner" ? req.user._id : req.user.owner;

  const employee = await Employee.findOne({
    _id: id,
    owner: ownerId,
  });

  if (!employee) {
    return res.status(404).json({
      message: "Employee not found.",
    });
  }

  // Deactivate employee manually
  if (employee.isActive) {
    employee.isActive = false;
    employee.deactivationReason = "manual";

    await employee.save();

    return res.status(200).json({
      message: "Employee has been deactivated successfully.",
      employee,
    });
  }

  // Employee is inactive, so check the active-employee limit
  const activeEmployees = await Employee.countDocuments({
    owner: ownerId,
    isActive: true,
  });

  const limitCheck = await checkPlanLimit(
    req.user,
    "maxEmployees",
    activeEmployees,
  );

  if (!limitCheck.allowed) {
    return res.status(403).json({
      message: `Your ${limitCheck.plan} plan allows a maximum of ${limitCheck.limit} active employees. Please deactivate another employee or upgrade your plan.`,
    });
  }

  // Manually activate employee
  employee.isActive = true;
  employee.deactivationReason = null;

  await employee.save();

  res.status(200).json({
    message: "Employee has been activated successfully.",
    employee,
  });
});

module.exports = {
  createEmployee,
  loginEmployee,
  logoutEmployee,
  getAllEmployees,
  getSingleEmployee,
  updateEmployee,
  toggleEmployeeStatus,
};
