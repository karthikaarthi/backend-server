import {Router} from 'express'
import upload from '../middlewares/multer.js';
import auth from '../middlewares/auth.js';
import { createHomeBannerSlider, deleteHomeBannerSlider, getHomeBannerSliders, removeImageFromCloudinary, updatedHomeBannerSlider, uploadImages , getHomeBannerSingleSlider} from '../controller/homeBanner.controller.js';



const homeBannerRouter = Router();


homeBannerRouter.post('/uploadimages',auth,upload.array('images'),uploadImages)
              .post("/create",auth,createHomeBannerSlider)
              .get("/",getHomeBannerSliders)
              .get("/:id",getHomeBannerSingleSlider)
              .delete('/deleteImage',auth, removeImageFromCloudinary)
              .delete('/:id', auth, deleteHomeBannerSlider)
              .put("/:id",auth, updatedHomeBannerSlider)
export default homeBannerRouter