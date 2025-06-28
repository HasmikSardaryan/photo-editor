import express from "express";
import { upload } from "../middlewares/multer.js";
import { get_user, add_collection, get_collection } from "../contollers/Post.controller.js";

const PostRouter = express.Router();

PostRouter.get("/get_user", get_user);
PostRouter.post('/collection', upload.single('photo') , add_collection); 
PostRouter.get('/collection', get_collection); 

export default PostRouter;
