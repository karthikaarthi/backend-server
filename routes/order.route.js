import {Router} from 'express'
import upload from '../middlewares/multer.js';
import auth from '../middlewares/auth.js';
import { countOrderController, createOrderController,  editOrderController,  getAllOrders,  getOrders, totalSalesOrderController, totalUsersOrderController } from '../controller/order.controller.js';


const orderRouter = Router();

orderRouter.post('/create',createOrderController);
orderRouter.get('/',auth,getOrders);
orderRouter.get('/all-orders',getAllOrders);
orderRouter.put('/:id',editOrderController);
orderRouter.get('/count',auth,countOrderController);
orderRouter.get('/sales-count',auth,totalSalesOrderController);
orderRouter.get('/users-count',auth,totalUsersOrderController);

export default orderRouter;             
