
import {v2 as cloudinary} from 'cloudinary';
import fs, { chmod } from 'fs';
import BlogModel from '../model/blog.model.js';

cloudinary.config({
    cloud_name:process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_Config_api_secret,
    secure: true
})



export async function uploadImages(request, response) {
    try {
        
       let imagesArr = [];

    const image=request.files;
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: false,
    }

    for(let i=0;i<image?.length;i++){
        const result = await cloudinary.uploader.upload(
            image[i].path,
            options,
          
        )
         imagesArr.push(result.secure_url);
                fs.unlinkSync(`uploads/${request.files[i].filename}`)
    }

    return response.status(200).json({
        images: imagesArr
    })
    } catch(error) {
        return  response.status(500).json({
            message: error.message || error,
            error:  true,
            success: false
        })
    }
    
}


export async function createBlog(request, response) {
    try {
        let  blog = new BlogModel({
            title: request.body.title,
            images: request.body.images,
            description: request.body.description,
        })

        if(!blog) {
            return response.status(500).json({
                message: "Blog not created",
                error: true,
                success: false
            })
        }

        blog = await blog.save();
        // imagesArr = [];

        return response.status(200).json({
            message: "Blog created",
            error: false,
            success: true,
            data: blog
        })

    } catch(error) {
       return  response.status(500).json({
            message: error.message || error,
            error:  true,
            success: false
        }) 
    }
}

export async function getBlogs(request, response) {

    try {
         const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage);

    const totalPosts = await BlogModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return response.status(404).json({
        message: "Page not found",
        error: true,
        success: false,
      });
    }
        const blogs = await BlogModel.find()

    .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();
        if(!blogs) {
            return response.status(500).json({
            success: false,
            error: true,
            message: "Blogs is not found",
            totalPages: totalPages
        })

        }
        return response.status(200).json({
            success: true,
            error: false,
            data: blogs
        })




    } catch(error) {
         return  response.status(500).json({
            message: error.message || error,
            error:  true,
            success: false
        }) 
    }
    
}

export async function getBlog(request, response) {
    try {

        const blog = await BlogModel.findById(request.params.id);
        if(!blog) {
            return  response.status(500).json({
            message: "The Blog with given id was not found",
            error:  true,
            success: false
        })  
        }
        return response.send({
            data: blog
        })
    }catch(error) {
         return  response.status(500).json({
            message: error.message || error,
            error:  true,
            success: false
        }) 
    }
}


export async function deleteBlog(request, response) {

    try {
        
        let blog = await BlogModel.findById(request.params.id) ;
        const images =  blog.images;    

        for(let img of images) {
            const imgUrl =img;
            const imgUrlList =  img.split('/');
            const image =imgUrlList[ imgUrlList.length-1];
            const imageName = image.split('.')[0];

            cloudinary.uploader.destroy(imageName,(error,result)=>{

            })

        }
        
      
        const deletedBlog = await BlogModel.findByIdAndDelete(request.params.id)

        if(!deletedBlog)  {
            response.status(404).json({
                message: "Blog not found!",
                success: false,

                error: true
            })
        }

        response.status(200).json({
            success: true,
            error: false,
            message: "Blog Deleted!"
        })

    } catch(error) {
           return  response.status(500).json({
            message: error.message || error,
            error:  true,
            success: false
        }) 
    
    }
}


export async function removeImageFromCloudinary(request, response) {

    try {
        const imgUrl = request.query.img;
    const urlArr = imgUrl.split('/')
    const image =  urlArr[urlArr.length - 1];
    const imageName = image.split('.')[0];
    console.log(imageName)
    if(imageName){
        const res = await cloudinary.uploader.destroy(
            imageName,
            (error, result )=> {
                
            }
            
        )
        if(res) {
        return response.status(200).json(
            {
                success: true,
                error: false,
                message: " Image deleted successfully "
            }
        )
    }
        console.log(res)
    }

    } catch(error) {
                   return  response.status(500).json({
            message: error.message || error,
            error:  true,
            success: false
        }) 
    }
    
    
}



export async function updatedBlog(request, response) {

    try {
        let imagesArray = request.body.images;

        const blog = await BlogModel.findByIdAndUpdate(
            request.params.id,
            {
                title: request.body.title,
                images: imagesArray.length>0? imagesArray[0]: request.body.images,
                description : request.body.description,

            },{new: true}
        )
        if(!blog) {
            return response.status(500).json({
                success: false,
                error: true,
                message: "Blog can updated"
            })
        }
       
        return response.status(200).json({
            success: true,
            error: false,
            data: blog
        })
    } catch(error) {
                   return  response.status(500).json({
            message: error.message || error,
            error:  true,
            success: false
        }) 
    }
    
}



