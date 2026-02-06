import {Router} from 'express';
import auth from '../middlewares/auth.js';
import { addAddressController, deleteAddressController, editAddressController, getAddressController, getAllAddressController } from '../controller/address.controller.js';


const addressRoute = Router() 


addressRoute.post('/add',auth,addAddressController)
            .get("/get/:id",getAddressController)
            .get("/get",getAllAddressController)
            .put("/:id",auth,editAddressController)
            .delete("/:id",deleteAddressController)

export default addressRoute;