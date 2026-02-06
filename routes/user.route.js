import {Router} from 'express';
import {registerUserController,verifyEmailController,loginUserController,logoutController, userAvatarController, removeImageFromCloudinary, updateUserDetails, forgotPasssword, resetpassword, refreshToken, userDetails, authWithGoogle, addReview, getReview, getUsercount, getAllUsers, deleteMultipleUser} from "../controller/user.controller.js";
import auth from '../middlewares/auth.js';
import upload from '../middlewares/multer.js';


const userRouter = Router()


userRouter.post("/register",registerUserController)
          .post('/authWithGoogle',authWithGoogle)
          .post("/verifyEmail",verifyEmailController)  
          .post("/login",loginUserController)  
          .get("/logout",auth,logoutController)  
          .put("/user-avatar",auth,upload.array('avatar'),userAvatarController)  
          .delete("/deleteImage",auth,removeImageFromCloudinary)  
          .put("/:id",auth,updateUserDetails)  
          .post("/forgot-password",forgotPasssword)  
          .post("/reset-password",resetpassword)  
          .post("/refresh-token", refreshToken)  
          .get("/user-details",auth, userDetails)  
          .post("/addReview",auth, addReview)  
          .get("/getReview",auth, getReview)  
          .get("/users-count",auth, getUsercount)  
          .get("/getAllUsers",auth, getAllUsers)  
          .delete("/delete-multiple",auth,deleteMultipleUser)



export default userRouter;