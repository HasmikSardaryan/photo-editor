import User from "../schemas/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET;

export const register_post = async (req, res) => {
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
