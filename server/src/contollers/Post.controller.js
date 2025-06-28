import User from "../schemas/user.js";
import { Photo } from "../schemas/photo.js";
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret';

export const get_user = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('username email photo');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    console.error("Get user error:", err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};


export const add_collection = async (req, res) => {
    try {
      const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ error: "No token provided" });
  
      const decoded = jwt.verify(token, JWT_SECRET);

      const user = await User.findById(decoded.id);
      if (!user) return res.status(404).json({ error: "User not found" });
  
      const { photo } = req.body;
      if (!photo) return res.status(400).json({ error: "No photo provided" });
  
      const newPhoto = new Photo({
        data: Buffer.from(photo, 'base64'), 
        contentType: 'image/jpeg'
      });
  
      await newPhoto.save();
  
      user.photos.push(newPhoto._id);
      await user.save();
  
      res.status(200).json({ message: "Photo added to collection" });
  
    } catch (error) {
      console.error("Error in add_coll:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
};

export const get_collection = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).populate('photos');
    if (!user) return res.status(404).json({ error: "User not found" });

    const photos = user.photos.map(photo => ({
      _id: photo._id,
      contentType: photo.contentType,
      base64: photo.data.toString('base64'),
    }));

    res.status(200).json({ photos });
  } catch (error) {
    console.error("Error getting collection:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
