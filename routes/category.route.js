import {Router} from 'express'
import { createCategory, deleteCategory, getCategories, getCategory, getCategoryCount,  getSubCategoryCount, removeImageFromCloudinary, updatedCategory, uploadImages } from '../controller/category.controller.js';
import upload from '../middlewares/multer.js';
import auth from '../middlewares/auth.js';



const categoryRouter = Router();

categoryRouter.post('/uploadimages',auth,upload.array('images'),uploadImages)
              .post("/create",auth,createCategory)
              .get("/",getCategories)
              .get('/get/count', getCategoryCount)
              
              .get('/get/count/subCat', getSubCategoryCount)
              .get('/:id', getCategory)
              .delete('/deleteImage',auth, removeImageFromCloudinary)
              .delete('/:id', auth, deleteCategory)
              .put("/:id",auth, updatedCategory)
export default categoryRouter