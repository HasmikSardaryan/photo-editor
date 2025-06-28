import User from "../schemas/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mailer from "../../mailer.js";

import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET;

export const register_post2 = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error during registration" });
  }
};


export const register_post = async (req, res) => {
  const { username, email, password } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isStrongPassword = password.length >= 8;

  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  if (!isStrongPassword) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }

  try {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);
    const codeExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Check if a user exists with the same email or username
    let existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser && existingUser.status === 'active') {
      // Case 1: Active user => block registration
      if (existingUser.email === email) {
        return res.status(400).json({ error: "Email already exists" });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ error: "Username already exists" });
      }
    }

    if (existingUser && existingUser.status === 'pending') {
      // Case 2: Reuse unverified user by updating details
      existingUser.username = username;
      existingUser.email = email;
      existingUser.password = hashedPassword;
      existingUser.verificationCode = code;
      existingUser.codeExpires = codeExpires;
      existingUser.status = 'pending';
      await existingUser.save();
    } else {
      // Case 3: No user exists — create new
      const user = new User({
        username,
        email,
        password: hashedPassword,
        verificationCode: code,
        codeExpires,
        status: 'pending',
      });
      await user.save();
    }

    await mailer.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Verification Code",
      html: `
        <p>Hello ${username || 'User'},</p>
        <p>Your registration verification code is:</p>
        <h2>${code}</h2>
        <p>Please enter this code in the app to verify your email.</p>
        <p>This code will expire in 10 minutes.</p>
      `,
    });

    res.status(201).json({ message: 'Verification code sent to your email' });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


export const verify_post = async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    if (user.verificationCode !== code)
      return res.status(400).json({ error: "Incorrect verification code" });

    if (new Date() > user.codeExpires)
      return res.status(400).json({ error: "Verification code expired" });

    user.status = 'active';
    user.verificationCode = undefined;
    user.codeExpires = undefined;
    await user.save();

    res.json({ message: "Account verified successfully" });

  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).json({ error: 'Server error during verification' });
  }
};


export const login_post = async (req, res) => {
  const { emailOrUsername, password } = req.body;
  
  try {
    const user = await User.findOne({
      $or: [
        { email: emailOrUsername },
        { username: emailOrUsername }
      ]
    });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) { 
      return res.status(401).json({ error: "Incorrect password" });
    }
    
    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 3 * 24 * 60 * 60 * 1000, 
    });

    res.status(200).json({ message: "Login successful", token }); // only token
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
};



export const getUser = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json({ user });
};

export const logout_post = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};
