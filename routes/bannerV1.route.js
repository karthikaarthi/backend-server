import {Router} from 'express'
import upload from '../middlewares/multer.js';
import auth from '../middlewares/auth.js';
import { addBanner, deleteBanner, getBanner, getBanners, removeImageFromCloudinary, updatedBanner, uploadImages } from '../controller/bannerV1.controller.js';

const bannerV1Router = Router();

bannerV1Router.post('/uploadimages',auth,upload.array('images'),uploadImages)
              .post('/add',auth,addBanner)  
              .get('/',auth,getBanners )
              .delete('/deleteImage',auth, removeImageFromCloudinary)  
              .delete('/:id', auth, deleteBanner)
              .put("/:id",auth, updatedBanner)  
              .get('/:id', getBanner)

export default bannerV1Router