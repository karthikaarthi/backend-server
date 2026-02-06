import {Router} from 'express'
import upload from '../middlewares/multer.js';
import auth from '../middlewares/auth.js';
import { addToMyListController, deleteToMyListController, getMyListController } from '../controller/myList.controller.js';

const myListRouter = Router();

myListRouter.post('/add', auth, addToMyListController)
            .delete('/:id', auth, deleteToMyListController)  
            .get('/', auth, getMyListController)  

export default myListRouter


