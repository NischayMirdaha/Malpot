import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js"; // Ensure correct path to user model
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mailtrap/emails.js";

// User registration
export const register = async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ username, email, password: hashPassword, role });
  await newUser.save();

  res.status(200).json({ message: `${role} registered successfully`, data: newUser });
};

// Verify email
export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.username);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.error("error in verifyEmail ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// User login
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const payload = { id: user.id, username: user.username, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token); // Set cookie
    res.status(200).json({ message: "Login successful", token, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

// User logout
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// Forgot password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    // Send email
    await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

    res.status(200).json({ success: true, message: "Password reset link sent to your email" });
  } catch (error) {
    console.error("Error in forgotPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("Error in resetPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Check auth (protected route using the isAuthenticated middleware)
export const checkAuth = async (req, res) => {
  try {
    const user = req.user; // `user` is populated in the isAuthenticated middleware

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error in checkAuth ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// // // // import bcrypt from "bcryptjs";
// // // // import jwt from "jsonwebtoken";
// // // // import User from "../models/userModel"; // Adjust path as needed


// // // // exports.loginUser = async (req, res) => {
// // // //   const { email, password } = req.body;

// // // //   try {
// // // //     // 1. Find user by email
// // // //     const user = await User.findOne({ email });
// // // //     if (!user) return res.status(404).json({ error: "User not found" });

// // // //     // 2. Verify password
// // // //     const isMatch = await bcrypt.compare(password, user.password);
// // // //     if (!isMatch) return res.status(400).json({ error: "Invalid password" });

// // // //     // 3. Check if user is admin (THIS IS WHERE YOUR ROLE CHECK HAPPENS)
// // // //     if (user.role !== 'admin') { // Ensure this check matches your frontend
// // // //       return res.status(403).json({ error: "Admin access required" });
// // // //     }

// // // //     // 4. Generate token (using JWT example)
// // // //     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

// // // //     res.status(200).json({ token, data: user });
// // // //   } catch (error) {
// // // //     res.status(500).json({ error: "Server error" });
// // // //   }
// // // // };