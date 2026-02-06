import bcryptjs from "bcryptjs";
import UserModel from "../model/user.model.js";
import sendEmailFun from "../config/sendEmail.js";
import verificationEmail from "../utils/verifyEmailTemplate.js";
import jwt from "jsonwebtoken";
import generatedAccessToken from "../utils/genertedAccessToken.js";
import genertedRefreshToken from "../utils/genertedRefreshToken.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import ReviewModel from "../model/rename.model.js";
import { error } from "console";

cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
});

var imagesArr = [];

export async function userAvatarController(request, response) {
  try {
    console.log(true)
    const userId = request.userId;
    const image = request.files;

    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      return response.status(500).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    const imgUrl = user.avatar;
    const urlArr = imgUrl.split("/");
    const avatar_image = urlArr[urlArr.length - 1];

    const imageName = avatar_image.split(".")[0];
    if (imageName) {
      const res = await cloudinary.uploader.destroy(
        `avatar/${imageName}`,
        (error, result) => {}
      );
    }
    const options = {
      user_filename: true,
      unique_filename: false,
      overwrite: false,
      folder:"avatar"
    };
    // for (let i = 0; i < image?.length; i++) {
      const uploadResult = await cloudinary.uploader.upload(
        image[0].path,
        options,
        // function (error, result) {
        //   console.log(result);
        //   imagesArr.push(result.secure_url);
        //   fs.unlinkSync(`uploads/${request.files[i].filename}`);
        //   console.log(request.files[i].filename);
        // }
      );
    // }
    user.avatar = uploadResult.secure_url;
    await user.save();
console.log('karthi');
    return response.status(200).json({
      _id: userId,
      avatar: uploadResult.secure_url
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function removeImageFromCloudinary(request, response) {
  const imgUrl = request.query.img;
  const urlArr = imgUrl.split("/");
  const image = urlArr[urlArr.length - 1];
  const imageName = image.split(".")[0];
  console.log(imageName);
  if (imageName) {
    const res = await cloudinary.uploader.destroy(
      imageName,
      (error, result) => {}
    );
    if (res) {
      return response.status(200).send(res);
    }
    console.log(res);
  }
}

export async function updateUserDetails(request, response) {
  try {
    const userId = request.userId;
    const { name, email, mobile, password } = request.body;
    const userExist = await UserModel.findById(userId);
    if (!userExist) {
      return response.status(400).send("The user cannot be updated");
    }
    let verifyCode = "";
    if (email !== userExist.email) {
      verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    }
    let hashPassword = "";

    if (password) {
      const salt = await bcryptjs.genSalt(10);
      hashPassword = await bcryptjs.hash(password, salt);
    } else {
      hashPassword = userExist.password;
    }

    const updateUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        mobile,
        password: hashPassword,
        verify_email: email ? false : true,
        otp: verifyCode !== "" ? verifyCode : null,
        otpExpires: verifyCode !== "" ? Date.now() + 600000 : "",
      },
      {
        new: true,
      }
    );

    if (email != userExist.email) {
      await sendEmailFun({
        send: email,
        subject: "Verify email from Ecommerce App",
        text: "",
        html: verificationEmail(name, verifyCode),
      });
    }

    return response.json({
      message: "User udated successfully",
      error: false,
      success: true,
      user: {
        _id: updateUser?._id,
        name: updateUser?.name,
        email: updateUser?.email,
        avatar: updateUser?.avatar,
        mobile: updateUser?.mobile,
      },
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function registerUserController(request, response) {
  try {
    let user;
    const { name, email, password } = request.body;
    if (!name || !email || !password) {
      return response.status(400).json({
        message: "provide email, name, password",
        error: true,
        success: false,
      });
    }

    user = await UserModel.findOne({ email: email });

    if (user) {
      return response.json({
        message: "User already Registered with this email",
        error: true,
        success: false,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const newUser = new UserModel({
      email: email,
      password: hashPassword,
      name: name,
      otp: verifyCode,
      otpExpires: Date.now() + 600000,
    });

    await newUser.save();

    const verifyEmail = await sendEmailFun({
      to: email,
      subject: "Verif email from Ecoomerce App",
      text: "",
      html: verificationEmail(name, verifyCode),
    });

    const token = jwt.sign(
      {
        email: newUser.email,
        id: newUser._id,
      },
      process.env.JSON_WEB_TOKEN_SECRET_KEY,
      {expriesIn: "1d"}
    );

    return response.status(200).json({
      success: true,
      error: false,
      message: "User registered successfully! Please verify your email.",
      token: token,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function authWithGoogle(request, response) {
  const { name, email, mobile, avatar, password, role } = request.body;

  try {
    const existingUser = await UserModel.findOne({ email: email });

    if (!existingUser) {
      const user = await UserModel.create({
        name: name,
        email: email,
        password,
        avatar,
        role: role,
        signInWithGoogle: true,
        verify_email: true,
      });
      await user.save();

      const accessToken = await generatedAccessToken(user._id);
      const refreshToken = await genertedRefreshToken(user._id);

      const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
        last_login_date: new Date(),
      });

      updateUser.save();

      const cookiesOption = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      };
      response.cookie("accessToken", accessToken, cookiesOption);
      response.cookie("refreshToken", refreshToken, cookiesOption);

      return response.status(200).json({
        message: "Login successfully",
        success: true,
        error: false,
        data: {
          accessToken,
          refreshToken,
        },
      });
    }
    else{
          const accessToken = await generatedAccessToken(existingUser._id);
      const refreshToken = await genertedRefreshToken(existingUser._id);

      const updateUser = await UserModel.findByIdAndUpdate(existingUser?._id, {
        last_login_date: new Date(),
       
      });

      updateUser.save();

      const cookiesOption = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      };
      response.cookie("accessToken", accessToken, cookiesOption);
      response.cookie("refreshToken", refreshToken, cookiesOption);

      return response.status(200).json({
        message: "Login successfully",
        success: true,
        error: false,
        data: {
          accessToken,
          refreshToken,
        },
      });
    }
    console.log(existingUser);
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function verifyEmailController(request, response) {
  try {
    const { email, otp } = request.body;
    let user = await UserModel.findOne({ email: email });
    if (!user) {
      return response.status(400).json({
        error: true,
        success: false,
        message: "User not found",
      });
    }
    const isCodeValid = user.otp === otp;
    const isNotExpired = user.otpExpires > Date.now();
    if (isCodeValid && isNotExpired) {
      user.verify_email = true;
      user.otp = null;
      user.otpExpires = null;
      await user.save();
      return response.status(200).json({
        success: true,
        error: false,
        message: "Email Verified Successfully",
      });
    } else if (!isCodeValid) {
      return response.status(400).json({
        error: true,
        success: false,
        message: "Invalid OTP",
      });
    } else {
      return response.status(400).json({
        error: true,
        success: false,
        message: "OTP expired",
      });
    }
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function loginUserController(request, response) {
  try {
    const { email, password } = request.body;

    const user = await UserModel.findOne({ email: email });
    if (!user) {
      response.status(400).json({
        error: true,
        success: false,
        message: "User Not Register",
      });
    }

    if (user.status != "Active") {
      response.status(400).json({
        error: true,
        success: false,
        message: "Contact to admin",
      });
    }

    if (user.verify_email !== true) {
      return response.status(400).json({
        message: "Your email is not verify yet please verify your email",
        error: true,
        success: false,
      });
    }

    const checkPassword = await bcryptjs.compare(password, user.password);

    if (!checkPassword) {
      response.status(400).json({
        error: true,
        success: false,
        message: "Check your password",
      });
    }

    const accessToken = await generatedAccessToken(user._id);
    const refreshToken = await genertedRefreshToken(user._id);

    const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
      last_login_date: new Date(),
    });

    updateUser.save();

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    response.cookie("accessToken", accessToken, cookiesOption);
    response.cookie("refreshToken", refreshToken, cookiesOption);

    return response.status(200).json({
      message: "Login successfully",
      success: true,
      error: false,
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function logoutController(request, response) {
  try {
    const userId = request.userId;

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    console.log("entered")
    

    response.clearCookie("accessToken", cookiesOption);
    response.clearCookie("refreshToken", cookiesOption);

    const removeRefreshToken = await UserModel.findByIdAndUpdate(userId, {
      refresh_token: "",
    });
    removeRefreshToken.save();

    return response.json({
      message: "Logout successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function forgotPasssword(request, response) {
  try {
    const { email } = request.body;
    const existUser = await UserModel.findOne({ email: email });
    if (!existUser) {
      return response.status(400).json({
        message: "User Not Found",
        error: true,
        success: false,
      });
    } else {
      let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

      existUser.otp = verifyCode;
      existUser.otpExpires = Date.now() + 600000;
      await existUser.save();
      const veriyUser = await sendEmailFun({
        to: email,
        subject: "Verify email from Ecommer App",
        text: "",
        html: verificationEmail(existUser.name, verifyCode),
      });
      return response.status(200).json({
        message: "Check your email",
        error: false,
        success: true,
      });
    }
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function resetpassword(request, response) {
  try {
    const { email, oldPassword, newPassword, confirmPassword } = request.body;
    if (!email || !newPassword || !confirmPassword) {
      return response.status(400).json({
        message: "Provide required fields email, newPassword, confirmPassword",
      });
    }
    const existUser = await UserModel.findOne({ email: email });
    if (!existUser) {
      return response.status(400).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }
    if (oldPassword) {
      if(user?.signInWithGoogle === false)
      {
         const checkPassword = await bcryptjs.compare(
        oldPassword,
        existUser.password
      );

      if (!checkPassword) {
        response.status(400).json({
          error: true,
          success: false,
          message: "Check your old password",
        });
      }


      }
         }

    if (confirmPassword !== newPassword) {
      return response.status(400).json({
        message: "Confirm password and password doesn't match",
        error: true,
        success: false,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(newPassword, salt);

    const userUpdate = await UserModel.findByIdAndUpdate(
      existUser._id,
      {
        password: hashPassword,
        signInWithGoogle: false
      },
      { new: true }
    );

    return response.status(200).json({
      message: " Password update successfully ",
      success: true,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function refreshToken(request, response) {
  try {
    const refreshToken =
      request.cookies.refreshToken ||
      request?.headers?.authorization?.split(" ")[1];

    if (!refreshToken) {
      return response.status(401).json({
        message: "Invalid token",
        error: true,
        success: false,
      });
    }

    const verifyToken = jwt.verify(
      refreshToken,
      process.env.SECRET_KEY_REFRESH_TOKEN
    );
    console.log(verifyToken);
    if (!verifyToken) {
      return response.status(401).json({
        message: "Invalid token",
        error: true,
        success: false,
      });
    }
    const userId = verifyToken?._id;
    const newAccessToken = await generatedAccessToken(userId);

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    response.cookie("accessToken", newAccessToken, cookiesOption);

    return response.json({
      success: true,

      error: false,
      message: "New access token generated",
      accessToken: newAccessToken,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function userDetails(request, response) {
  try {
    console.log(true);
    const userId = request.userId;
    const user = await UserModel.findById(userId)
      .populate("address_details")
      .select({ password: 0, refresh_token: 0 });

    return response.json({
      message: "User Details",
      success: true,
      data: user,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function addReview(request, response) {

  try {

    const { userName,image,review, rating,userId, productId} = request.body;

    const userReview = new ReviewModel(
      {
        userName,
        image,
        review,
        rating,
        userId,
        productId
      }
    )

    await userReview.save()

    return response.status(200).json(
      {
        success: true,
        error: false,
        message: "Review added successfully"
      }
    )
  } catch(error) {
     return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
  
}
export async function getReview(request, response) {

  try {

    const review = await ReviewModel.find({productId: request.query.productId});
    if(!review){
       return response.status(500).json(
      {
        success: false,
        error: true,
      }
    )
    }
   
    return response.status(200).json(
      {
        success: true,
        error: false,
        review: review, 
      }
    )
  } catch(error) {
     return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
  
}

export async function getUsercount(request, response) {

  try {

    const count = await UserModel.countDocuments();
   
   
    return response.status(200).json(
      {
        success: true,
        error: false,
        count: count
      }
    )
  } catch(error) {
     return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
  
}

export async function getAllUsers(request, response) {

  try {

    const users = await UserModel.find();
    if(!users){
       return response.status(500).json(
      {
        success: false,
        error: true,
      }
    )
    }
   
    return response.status(200).json(
      {
        success: true,
        error: false,
        users:users
      }
    )
  } catch(error) {
     return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
  
}

export async function deleteMultipleUser(request, response) {

  try {
    console.log('rrr',request.body)
    const {userIds} = request.body;
    await UserModel.deleteMany({_id: {$in: userIds}})
   
    return response.status(200).json(
      {
        success: true,
        error: false,
       message: "Users deleted successfully"
      }
    )
  } catch(error) {
     return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
  
}
