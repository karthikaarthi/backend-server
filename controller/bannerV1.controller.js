import {v2 as cloudinary} from 'cloudinary';
import fs, { chmod } from 'fs';
import BannerV1Model from '../model/bannerV1.model.js';

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


export async function addBanner(request, response) {
    console.log('ddd',request?.body?.images)
    try {
                let imagesArray = request.body.images;

        let  bannerV1 = new BannerV1Model({
            bannerTitle: request.body.bannerTitle,
            catId: request.body.catId,
            subCatId: request.body.subCatId,
            thirdSubCatId: request.body.thirdSubCatId,
            price: request.body.price,
            alignInfo: request.body.alignInfo,
                images: imagesArray.length>0? imagesArray[0]: request.body.images,
        })

        if(!bannerV1) {
            return response.status(500).json({
                message: "Banner not added",
                error: true,
                success: false
            })
        }

        bannerV1 = await bannerV1.save();
        // imagesArr = [];

        return response.status(200).json({
            message: "Banner is added",
            error: false,
            success: true,
            data: bannerV1
        })

    } catch(error) {
       return  response.status(500).json({
            message: error.message || error,
            error:  true,
            success: false
        }) 
    }
}

export async function getBanners(request, response) {

    try {
        const banners = await BannerV1Model.find()
        if(!banners) {
            return response.status(500).json({
            success: true,
            error: false,
            message: "Banners not found"
        })

        }
        return response.status(200).json({
            success: true,
            error: false,
            data: banners
        })




    } catch(error) {
         return  response.status(500).json({
            message: error.message || error,
            error:  true,
            success: false
        }) 
    }
    
}


export async function deleteBanner(request, response) {

    try {
        let banner = await BannerV1Model.findByIdAndDelete(request.params.id) ;
        if(!banner)  {
            response.status(404).json({
                message: "Banner is not found!",
                success: false,

                error: true
            })
        }

        return response.status(200).json({
            success: true,
            error: false,
            message: "Banner Deleted!"
        })

    } catch(error) {
           return  response.status(500).json({
            message: error.message || error,
            error:  true,
            success: false
        }) 
    
    }
}

export async function updatedBanner(request, response) {

    try {
        let imagesArray = request.body.images;

        const banner = await BannerV1Model.findByIdAndUpdate(
            request.params.id,
            {
                bannerTitle: request.body.bannerTitle,
                images: imagesArray.length>0? imagesArray[0]: request.body.images,
                catId : request.body.catId,
                subCatId : request.body.subCatId,
                thirdSubCatId : request.body.thirdSubCatId, 
                alignInfo : request.body.alignInfo, 
                price : request.body.price,

            },{new: true}
        )
        if(!banner) {
            return response.status(500).json({
                success: false,
                error: true,
                message: "Banner can not updated"
            })
        }
       
        return response.status(200).json({
            success: true,
            error: false,
            banner: banner
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

export async function getBanner(request, response) {
    try {

        const banner = await BannerV1Model.findById(request.params.id);
        if(!banner) {
            return  response.status(500).json({
            message: "The banner with given id was not found",
            error:  true,
            success: false
        })  
        }
        return response.send({
            banner: banner
        })
    }catch(error) {
         return  response.status(500).json({
            message: error.message || error,
            error:  true,
            success: false
        }) 
    }
}


