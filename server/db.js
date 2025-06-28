import mongoose from "mongoose";

const connectToDB = async() => {
    try {
        await mongoose.connect('mongodb://localhost:27017/photo-editor');
        console.log('Connected to MongoDB');
        
    } catch (error) {
        console.log(error);
    }
}

export default connectToDB;