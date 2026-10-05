const Owner = require("../models/ownerModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_TOKEN = process.env.JWT_TOKEN;
const Subscription = require("../models/subscriptionModel");

const registerOwner = asyncHandler(async (req, res) => {
  const { name, email, businessName, phone, password } = req.body;

  if (!name || !email || !businessName || !phone || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const existing = await Owner.findOne({ email });

  if (existing) {
    return res.status(400).json({
      message: "Email already exists",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  // Create owner
  const owner = await Owner.create({
    name,
    email,
    businessName,
    phone,
    password: hashPassword,
  });

  // Give the new business a Free subscription
  await Subscription.create({
    owner: owner._id,
    plan: "free",
    status: "active",
  });

  const token = jwt.sign(
    {
      id: owner._id,
      role: owner.role,
    },
    JWT_TOKEN,
    { expiresIn: "1d" },
  );

  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 84600),
    sameSite: "none",
    secure: true,
  });

  if (owner) {
    const { _id, name, email, businessName, phone, role } = owner;

    res.status(201).json({
      _id,
      name,
      email,
      businessName,
      phone,
      role,
    });
  } else {
    return res.status(400).json({
      message: "Invalid details",
    });
  }
});

const loginOwner = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const owner = await Owner.findOne({ email: email.toLowerCase() });

  if (!owner) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, owner.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const token = jwt.sign(
    {
      id: owner._id,
      role: owner.role,
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

  if (owner) {
    const { _id, name, email, businessName, phone, role } = owner;

    res.status(201).json({ _id, name, email, businessName, phone, role });
  } else {
    return res.status(400).json({ message: "Invalid details" });
  }
});

const logoutOwner = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });

  res.status(200).json({ message: "Logged out successfully" });
});

const getOwnerProfile = asyncHandler(async (req, res) => {
  const owner = req.user;

  if (owner) {
    const { _id, name, email, businessName, phone, role } = owner;

    res.status(201).json({ _id, name, email, businessName, phone, role });
  } else {
    return res.status(404).json({ message: "Owner not found" });
  }
});

const updateOwnerProfile = asyncHandler(async (req, res) => {
  const { name, businessName, phone } = req.body;

  const owner = await Owner.findById(req.user._id);

  if (!owner) {
    return res.status(404).json({
      message: "Owner not found",
    });
  }

  const update = {};

  // Name
  if (name !== undefined) {
    const formattedName = name.trim();

    if (!formattedName) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    if (formattedName !== owner.name) {
      update.name = formattedName;
    }
  }

  // Business Name
  if (businessName !== undefined) {
    const formattedBusinessName = businessName.trim();

    if (!formattedBusinessName) {
      return res.status(400).json({
        message: "Business name is required",
      });
    }

    if (formattedBusinessName !== owner.businessName) {
      update.businessName = formattedBusinessName;
    }
  }

  // Phone
  if (phone !== undefined) {
    const formattedPhone = phone.trim();

    if (!formattedPhone) {
      return res.status(400).json({
        message: "Phone is required",
      });
    }

    if (formattedPhone !== owner.phone) {
      update.phone = formattedPhone;
    }
  }

  // No changes
  if (Object.keys(update).length === 0) {
    return res.status(400).json({
      message: "No changes made.",
    });
  }

  // Apply changes
  Object.assign(owner, update);

  await owner.save();

  const updatedOwner = await Owner.findById(req.user._id).select("-password");

  res.status(200).json(updatedOwner);
});

const changeOwnerEmail = asyncHandler(async (req, res) => {
  const { password, newEmail } = req.body;

  if (!password || !newEmail) {
    return res
      .status(400)
      .json({ message: "Password and new email are required" });
  }

  const owner = await Owner.findById(req.user._id);

  if (!owner) {
    return res.status(404).json({ message: "Owner not found" });
  }

  const isMatch = await bcrypt.compare(password, owner.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Incorrect password" });
  }

  const formatedEmail = newEmail.trim().toLowerCase();

  if (formatedEmail === owner.email) {
    return res
      .status(400)
      .json({ message: "New email must be different from the current one" });
  }

  const existingOwner = await Owner.findOne({ email: formatedEmail });

  if (existingOwner) {
    return res.status(400).json({ message: "Email is already in use" });
  }

  owner.email = formatedEmail;

  await owner.save();

  const { _id, name, email, businessName, phone, role } = owner;
  return res.status(200).json({ _id, name, email, businessName, phone, role });
});

const changeOwnerPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      message:
        "Current password, new password and confirm password are required.",
    });
  }

  const owner = await Owner.findById(req.user._id);

  if (!owner) {
    return res.status(404).json({
      message: "Owner not found.",
    });
  }

  const isMatch = await bcrypt.compare(currentPassword, owner.password);

  if (!isMatch) {
    return res.status(401).json({
      message: "Current password is incorrect.",
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      message: "Passwords do not match.",
    });
  }

  if (currentPassword === newPassword) {
    return res.status(400).json({
      message: "New password must be different from the current password.",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  owner.password = hashedPassword;

  await owner.save();

  return res.status(200).json({
    message: "Password updated successfully.",
  });
});

module.exports = {
  registerOwner,
  loginOwner,
  logoutOwner,
  getOwnerProfile,
  updateOwnerProfile,
  changeOwnerEmail,
  changeOwnerPassword,
};
