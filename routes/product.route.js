import {Router} from 'express'
import upload from '../middlewares/multer.js';
import auth from '../middlewares/auth.js';
import { createProduct, createProductRAMS, createProductSize, createProductWeight, deleteMultipleProduct, deleteProduct, deleteProductRAMS, deleteProductSize, deleteProductWeight,  getAllProducts, getAllProductsByCatId, getAllProductsByCatName, getAllProductsByPrice, getAllProductsByRating, getAllProductsBySubCatId, getAllProductsBySubCatName, getAllProductsByThirdLevelCatId, getAllProductsByThirdLevelCatName, getAllProductsCount, getAllProductsRAMS, getAllProductsSize, getAllProductsWeight, getFeaturedProducts, getFilters, getSingleProduct, getSingleProductRAMS, getSingleProductSize, getSingleProductWeight, productsCount, removeBannerImageFromCloudinary, removeImageFromCloudinary, sortBy, updatedProduct, updatedProductRAMS, updatedProductSize, updatedProductWeight,  uploadBannerImages,  uploadImages } from '../controller/product.controller.js';


const productRouter = Router();

productRouter.post('/uploadimages',auth,upload.array('images'),uploadImages)

             .post('/uploadBannerImages',auth,upload.array('bannerimages'),uploadBannerImages)
             .post('/create',auth, createProduct)
            .post('/filters', getFilters)
            .post('/sortBy', sortBy)
            .get('/products-count',auth,productsCount)

             .get('/getAllProducts', getAllProducts)
             .get('/getAllProductsByCatId/:id', getAllProductsByCatId)
             .get('/getAllProductsByCatName', getAllProductsByCatName)
             .get('/getAllProductsBySubCatId/:id', getAllProductsBySubCatId)
             .get('/getAllProductsBySubCatName', getAllProductsBySubCatName)
             .get('/getAllProductsByThirdLevelCatId/:id', getAllProductsByThirdLevelCatId)
             .get('/getAllProductsByThirdLevelCatName', getAllProductsByThirdLevelCatName)
             .get('/getAllProductsByPrice', getAllProductsByPrice)
             .get('/getAllProductsByRating', getAllProductsByRating)
             .get('/getAllProductsByCount', getAllProductsCount)
             .get('/getFeaturedProducts', getFeaturedProducts)
            .delete('/deleteBannerImage',removeBannerImageFromCloudinary)

             .delete('/:id',auth, deleteProduct)
            .get('/getAllProductRAMS',getAllProductsRAMS)
            .get('/getAllProductWeight',getAllProductsWeight)
            .get('/getAllProductSize',getAllProductsSize)
             .get("/productRAMS/:id",getSingleProductRAMS)   
             .get("/productWeight/:id",getSingleProductWeight)   
             .get("/productSize/:id",getSingleProductSize)  
 
             .get('/:id',getSingleProduct)
             .delete('/deleteImage',removeImageFromCloudinary)
             .delete("/delete-multiple",deleteMultipleProduct)
             .put('/updatedProduct/:id',auth,updatedProduct)
             .post('/productRAMS/create',auth,createProductRAMS)
             .post('/productWeight/create',auth,createProductWeight)
             .post('/productSize/create',auth,createProductSize)
             .delete('/productRAMS/:id',auth,deleteProductRAMS)
             .delete('/productWeight/:id',auth,deleteProductWeight)
             .delete('/productSize/:id',auth,deleteProductSize)
             .put('/productRAMS/:id',auth,updatedProductRAMS)
             .put('/productWeight/:id',auth,updatedProductWeight)
             .put('/productSize/:id',auth,updatedProductSize)
             
             
export default productRouter;             

