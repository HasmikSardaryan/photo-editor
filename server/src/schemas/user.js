import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['invited', 'pending', 'active'], 
    default: 'pending' 
  },
  email: { 
    type: String,
    required: true,
    lowercase: true, 
    trim: true 
  },
  photos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Photo'
  }],  
  inviteToken: String,
  inviteTokenExpires: Date,

  verificationCode: String,
  codeExpires: Date,

  resetToken: String,
  resetTokenExpires: Date
});


const User = mongoose.model("User", userSchema);
export default User;
