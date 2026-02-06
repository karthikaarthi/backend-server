
import {v2 as cloudinary} from 'cloudinary';
import fs, { chmod } from 'fs';
import HomeBannerSliderModel from '../model/homeBannerSlider.model.js';

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

export async function createHomeBannerSlider(request, response) {
    try {
        let  homeBannerSlider = new HomeBannerSliderModel({
            images: request.body.images,
        })

        if(!homeBannerSlider) {
            return response.status(500).json({
                message: "Home banner not created",
                error: true,
                success: false
            })
        }

        homeBannerSlider = await homeBannerSlider.save();
        // imagesArr = [];

        return response.status(200).json({
            message: "Home Banner Slide created",
            error: false,
            success: true,
            category: homeBannerSlider
        })

    } catch(error) {
       return  response.status(500).json({
            message: error.message || error,
            error:  true,
            success: false
        }) 
    }
}


export async function getHomeBannerSliders(request, response) {

    try {
        const homeBannerSliders = await HomeBannerSliderModel.find()
        return response.status(200).json({
            success: true,
            error: false,
            data: homeBannerSliders
        })




    } catch(error) {
         return  response.status(500).json({
            message: error.message || error,
            error:  true,
            success: false
        }) 
    }
    
}


export async function getHomeBannerSingleSlider(request, response) {

    try {
        const homeBannerSlider= await HomeBannerSliderModel.findById(request.params.id)
        if(!homeBannerSlider){
            return response.status(500).json({
            success: false,
            error: true,
            message:"Home banner Slider not found"
        })
        }
        return response.status(200).json({
            success: true,
            error: false,
            data: homeBannerSlider
        })




    } catch(error) {
         return  response.status(500).json({
            message: error.message || error,
            error:  true,
            success: false
        }) 
    }
    
}



// export async function getCategory(request, response) {
//     try {

//         const category = await CategoryModel.findById(request.params.id);
//         if(!category) {
//             return  response.status(500).json({
//             message: "The category with given id was not found",
//             error:  true,
//             success: false
//         })  
//         }
//         return response.send({
//             category: category
//         })
//     }catch(error) {
//          return  response.status(500).json({
//             message: error.message || error,
//             error:  true,
//             success: false
//         }) 
//     }
// }

export async function deleteHomeBannerSlider(request, response) {

    try {
        
        let homeBannerSlider = await HomeBannerSliderModel.findById(request.params.id) ;
        console.log(homeBannerSlider)
        const images = homeBannerSlider.images;    

        for(let img of images) {
            const imgUrl =img;
            const imgUrlList =  img.split('/');
            const image =imgUrlList[ imgUrlList.length-1];
            const imageName = image.split('.')[0];

            cloudinary.uploader.destroy(imageName,(error,result)=>{

            })

        }
                    const deleteHomeBannerSlider = await HomeBannerSliderModel.findByIdAndDelete(request.params.id);


        if(!homeBannerSlider)  {
            response.status(404).json({
                message: "Home Banner Slider is not found!",
                success: false,

                error: true
            })
        }

        response.status(200).json({
            success: true,
            error: false,
            message: "Home Banner slider Deleted!"
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


export async function updatedHomeBannerSlider(request, response) {

    try {
        let imagesArray = request.body.images;

        const homeBannerSlider = await HomeBannerSliderModel.findByIdAndUpdate(
            request.params.id,
            {
                images: imagesArray.length>0? imagesArray[0]: request.body.images,

            },{new: true}
        )
        if(!homeBannerSlider) {
            return response.status(500).json({
                success: false,
                error: true,
                message: "Home Banner Slider can not updated "
            })
        }
       
        return response.status(200).json({
            success: true,
            error: false,
            category: homeBannerSlider
        })
    } catch(error) {
                   return  response.status(500).json({
            message: error.message || error,
            error:  true,
            success: false
        }) 
    }
    
}