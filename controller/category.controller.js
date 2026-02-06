import CategoryModel from '../model/category.model.js'

import {v2 as cloudinary} from 'cloudinary';
import fs, { chmod } from 'fs';

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

export async function createCategory(request, response) {
    console.log('imagearray: ',request.body)
    try {
        let  category = new CategoryModel({
            name: request.body.name,
            images: request.body.images,
            parentId: request.body.parentId,
            parentCatName: request.body.parentCatName,
        })

        if(!category) {
            return response.status(500).json({
                message: "Category not created",
                error: true,
                success: false
            })
        }

        category = await category.save();
        // imagesArr = [];

        return response.status(200).json({
            message: "Category created",
            error: false,
            success: true,
            category: category
        })

    } catch(error) {
       return  response.status(500).json({
            message: error.message || error,
            error:  true,
            success: false
        }) 
    }
}


export async function getCategories(request, response) {

    try {
        const categories = await CategoryModel.find()
        let categoryMap = {}
        categories.forEach(cat => {
            categoryMap[cat._id]={...cat._doc,children: []}
        });
        console.log(categories)
        const rootCategories =[];
        categories.forEach(cat => {
            if(cat.parentId) {
                categoryMap[cat.parentId].children.push(categoryMap [cat._id]);
            }
            else{
                rootCategories.push(categoryMap[cat._id])                
            }
        })

        return response.status(200).json({
            success: true,
            error: false,
            data: rootCategories
        })



        console.log(categoryMap)

    } catch(error) {
         return  response.status(500).json({
            message: error.message || error,
            error:  true,
            success: false
        }) 
    }
    
}


export async function getCategoryCount(request, response) {
    try {
        const categoryCount = await CategoryModel.countDocuments({parentId: undefined})
        if(!categoryCount) {
             return  response.status(500).json({
           
            error:  true,
            success: false
        }) 
       

        }
         return response.send({

            categoryCount: categoryCount,
            success: true,
            error: false
        })
    }catch(error) {
         return  response.status(500).json({
            message: error.message || error,
            error:  true,
            success: false
        }) 
    }

}

export async function getSubCategoryCount(request, response) {
    try {

        const categories = await CategoryModel.find();

        if(!categories) {
             return  response.status(500).json({
           
            error:  true,
            success: false
        }) 
        }
        let subCatList = []
        for(let cat of categories) {
            if(cat.parentId ) {
                subCatList.push(cat)
            }
        }
        return response.send({
            subCategoryCount: subCatList.length
        })

    }catch(error) {
         return  response.status(500).json({
            message: error.message || error,
            error:  true,
            success: false
        }) 
    }
}


export async function getCategory(request, response) {
    try {

        const category = await CategoryModel.findById(request.params.id);
        if(!category) {
            return  response.status(500).json({
            message: "The category with given id was not found",
            error:  true,
            success: false
        })  
        }
        return response.send({
            category: category
        })
    }catch(error) {
         return  response.status(500).json({
            message: error.message || error,
            error:  true,
            success: false
        }) 
    }
}

export async function deleteCategory(request, response) {

    try {
        
        let category = await CategoryModel.findById(request.params.id) ;
        const images =  category.images;    

        for(let img of images) {
            const imgUrl =img;
            const imgUrlList =  img.split('/');
            const image =imgUrlList[ imgUrlList.length-1];
            const imageName = image.split('.')[0];

            cloudinary.uploader.destroy(imageName,(error,result)=>{

            })

        }
        
        const subCatgory = await CategoryModel.find({
            parentId: request.params.id
        })

        for (let subCat of subCatgory){
            const thirdSubCategory = await CategoryModel.find(
                {parentId: subCat._id}
            )

            for(let thirdCat of thirdSubCategory) {
                const deletedThirdSubCat = await CategoryModel.findByIdAndDelete(thirdCat._id);
            }
            const deleteSubCat = await CategoryModel.findByIdAndDelete(subCat._id);

        }

        const deleteCategory = await CategoryModel.findByIdAndDelete(request.params.id)

        if(!deleteCategory)  {
            response.status(404).json({
                message: "Category not found!",
                success: false,

                error: true
            })
        }

        response.status(200).json({
            success: true,
            error: false,
            message: "Category Deleted!"
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


export async function updatedCategory(request, response) {

    try {
        let imagesArray = request.body.images;

        const category = await CategoryModel.findByIdAndUpdate(
            request.params.id,
            {
                name: request.body.name,
                images: imagesArray.length>0? imagesArray[0]: request.body.images,
                parentId : request.body.parentId,
                parentCatName : request.body.parentCatName,

            },{new: true}
        )
        if(!category) {
            return response.status(500).json({
                success: false,
                error: true,
                message: "Category can updated"
            })
        }
       
        return response.status(200).json({
            success: true,
            error: false,
            category: category
        })
    } catch(error) {
                   return  response.status(500).json({
            message: error.message || error,
            error:  true,
            success: false
        }) 
    }
    
}