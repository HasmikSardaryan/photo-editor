import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    
    trim: true,
  },
  password: {
    require: true,
    type: String,
  },
  status: {
    type: String,
    enum: ['invited', 'active'], 
    default: 'invited'
  },
  email: { 
    type: String,
    require: true,
    lowercase: true, 
    trim: true 
  },
  photos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Photo'
  }],  
  inviteToken: {
    type: String,
  },
  inviteTokenExpires: {   
    type: Date,
  },
  resetToken: {
    type: String,
  },
  resetTokenExpires: {   
    type: Date,
  }
});

const User = mongoose.model("User", userSchema);
export default User;
