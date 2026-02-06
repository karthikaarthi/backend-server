import {Router} from 'express'
import upload from '../middlewares/multer.js';
import auth from '../middlewares/auth.js';
import {  addTocartItemController, deleteTocartItemQtyController, deleteTocartItems, getTocartItemController, updateTocartItemQtyController } from '../controller/cart.controller.js';


const cartRouter = Router();

cartRouter          .delete("/delete-cart-item/:id",auth, deleteTocartItemQtyController)

            .post("/add",auth,addTocartItemController)
          .get("/get",auth, getTocartItemController)
          .delete("/emptyCart",auth, deleteTocartItems)
          .put("/update-qty",auth, updateTocartItemQtyController)

export default  cartRouter
