import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// POST /api/auth/register
  // - Validate input
  // - Check if user exists
  // - Hash password
  // - Save user
  // - Return user (without password)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
// hash passowrd
    const salt = await bcrypt.genSalt(10); // Adds extra randomness
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save the new user to MongoDB
    const user = await User.create({ 
      name, 
      email, 
      password: hashedPassword 
    });

    //Return the user info w/o password
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email
    });

  } catch (error) {
    res.status(500).json({ message: "Server error during registration" });
  }
});

// POST /api/auth/login
  // - Find user
  // - Compare password
  // - Generate JWT
  // - Return token

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by their email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" }); // Keep error vague for hackers!
    }

    // Compare the typed password with the blended password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate the VIP Wristband (JWT Token)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d" // Token lasts for 30 days
    });

    // Give the token to the user
    res.status(200).json({ token });

  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
});

export default router;





