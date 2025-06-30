import express from "express";
import { upload } from "../middlewares/multer.js";
import { get_user, add_photo, get_collection, post_edit} from "../contollers/Post.controller.js";

const PostRouter = express.Router();

PostRouter.get("/get_user", get_user);
PostRouter.post('/photo', upload.single('photo') , add_photo); 
PostRouter.get('/collection', get_collection);
PostRouter.patch('/photo/:id', post_edit);

export default PostRouter;
