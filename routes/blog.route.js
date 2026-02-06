import { Router } from "express";

import upload from '../middlewares/multer.js';
import auth from '../middlewares/auth.js';
import { createBlog, deleteBlog, getBlog, getBlogs, removeImageFromCloudinary, updatedBlog, uploadImages } from "../controller/blog.controller.js";

const blogRouter = Router();


blogRouter.post('/uploadimages',auth,upload.array('images'),uploadImages)
          .post("/create",auth,createBlog) 
          .get("/",getBlogs) 
          .get('/:id', getBlog)
          .delete('/deleteImage',auth, removeImageFromCloudinary)
          .delete('/:id', auth, deleteBlog)
            .put("/:id",auth, updatedBlog)

export default blogRouter

