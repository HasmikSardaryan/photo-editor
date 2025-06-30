// import mongoose from "mongoose";

// const connectToDB = async() => {
//     try {
//         await mongoose.connect('mongodb://localhost:27017/photo-editor');
//         console.log('Connected to MongoDB');
        
//     } catch (error) {
//         console.log(error);
//     }
// }

// export default connectToDB;


import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB Atlas");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
};

export default connectToDB;
