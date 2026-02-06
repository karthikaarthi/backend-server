import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import ProductModel from "../model/product.model.js";
import ProductRAMSModel from "../model/productRAMS.model.js";
import ProductWeightModel from "../model/productWeight.model.js";
import ProductSizeModel from "../model/productSize.model.js";

cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
});

//  imagesArr = [];

export async function uploadImages(request, response) {
  try {
    var imagesArr = [];

    const image = request.files;
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: false,
    };

    for (let i = 0; i < image?.length; i++) {
      const img = await cloudinary.uploader.upload(
        image[i].path,
        options,
        function (error, result) {
          imagesArr.push(result.secure_url);
          fs.unlinkSync(`uploads/${request.files[i].filename}`);
        }
      );
    }

    return response.status(200).json({
      images: imagesArr,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}


export async function uploadBannerImages(request, response) {
  try {
    var imagesArr = [];

    const image = request.files;
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: false,
      folder:"bannerimages",

    };

    for (let i = 0; i < image?.length; i++) {
      const img = await cloudinary.uploader.upload(
        image[i].path,
        options,
        function (error, result) {
          imagesArr.push(result.secure_url);
          fs.unlinkSync(`uploads/${request.files[i].filename}`);
        }
      );
    }

    return response.status(200).json({
      images: imagesArr,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}






export async function createProduct(request, response) {
  try {
    let product = new ProductModel({
      name: request.body.name,
      bannerTitleName: request.body.bannerTitleName,
      description: request.body.description,
      images: request.body.images,
      bannerImages: request.body.bannerImages,
      brand: request.body.brand,
      price: request.body.price,
      oldPrice: request.body.oldPrice,
      catName: request.body.catName,
      catId: request.body.catId,
      category: request.body.category,
      subCatId: request.body.subCatId,
      subCat: request.body.subCat,
      thirdSubCat: request.body.thirdSubCat,
      thirdSubCatId: request.body.thirdSubCatId,
      countInStock: request.body.countInStock,
      rating: request.body.rating,
      isFeatured: request.body.isFeatured,
      discount: request.body.discount,
      productRam: request.body.productRam,
      size: request.body.size,
      productWeight: request.body.productWeight,
    });
    product = await product.save();

    if (!product) {
      return response.status(500).json({
        error: true,
        success: false,
        message: "Product  not created",
      });
    }

    // imagesArr = [];

    return response.status(200).json({
      message: "product created successfully",
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

export async function createProductRAMS(request, response) {
  try{
  const productRAMS =  new ProductRAMSModel({
    name: request.body.name
  })    
  await productRAMS.save();

  if(!productRAMS){
      return response.status(500).json(
    {
      message: "ProductRAMS not  created ",
      error: true,
      success: false
    }
  )

  }

  return response.status(200).json(
    {
      message: "ProductRAMS created successfully",
      error: false,
      success: true
    }
  )

  }catch(error){
        return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });

  }
}

export async function createProductWeight(request, response) {
  try{
  const productWeight =  new ProductWeightModel({
    name: request.body.name
  })    
  await productWeight.save();

  if(!productWeight){
      return response.status(500).json(
    {
      message: "ProductWeight not  created ",
      error: true,
      success: false
    }
  )

  }

  return response.status(200).json(
    {
      message: "ProductWeight created successfully",
      error: false,
      success: true
    }
  )

  }catch(error){
        return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });

  }
}

export async function createProductSize(request, response) {
  try{
  const productSize =  new ProductSizeModel({
    name: request.body.name
  })    
  await productSize.save();

  if(!productSize){
      return response.status(500).json(
    {
      message: "Product Size not  created ",
      error: true,
      success: false
    }
  )

  }

  return response.status(200).json(
    {
      message: "Product size created successfully",
      error: false,
      success: true
    }
  )

  }catch(error){
        return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });

  }
}


export async function getAllProducts(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage);

    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return response.status(404).json({
        message: "Page not found",
        error: true,
        success: false,
      });
    }
    const products = await ProductModel.find()
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();
    if (!products) {
      return response.status(500).json({
        message: "Products not found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      success: true,
      error: false,
      datas: products,
      page: page,
      totalPages: totalPages,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}


export async function getFilters (request, response){
  const {catId, subCatId, thirdSubCatId, minPrice, maxPrice, rating, page, limit}= request.body
  const filters = {}

  if(catId?.length){
    filters.catId = catId
  }
  if(subCatId?.length){
    filters.subCatId = subCatId
  }
  if(thirdSubCatId?.length){
    filters.thirdSubCatId = thirdSubCatId
    
  }
  if(minPrice || maxPrice){
    filters.price = {
      $gte: +minPrice || 0,
      $lte: +maxPrice || infinity
    }

  }
  if(rating?.length){
    filters.rating= {
      $in: rating
    }
  }

  try{
   const products =  await ProductModel.find(filters).populate("category")
  //  .skip((page-1)*limit)
   .limit(parseInt(limit));

   const total = await ProductModel.countDocuments(filters);


   return response.status(200).json(
    {
      error: false,
      success: true,
      products: products,
      total: total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)

    }
   )

  }catch(error){
     return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }

}
export async function getAllProductsRAMS(request, response) {
  try {
    

    const productRAMS = await ProductRAMSModel.find();
    console.log(true)
    if(!productRAMS){
          return response.status(500).json({
      success: false,
     error: true,
      message: "ProductRams not found"
    });

    }
    return response.status(200).json({
      success: true,
      error: false,
      data: productRAMS
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function getAllProductsWeight(request, response) {
  try {
    

    const productWeight = await ProductWeightModel.find();
    if(!productWeight){
          return response.status(500).json({
      success: false,
     error: true,
      message: "ProductWeight not found"
    });

    }
    return response.status(200).json({
      success: true,
      error: false,
      data: productWeight
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}


export async function getAllProductsSize(request, response) {
  try {
    

    const productSize = await ProductSizeModel.find();
    if(!productSize){
          return response.status(500).json({
      success: false,
     error: true,
      message: "Product Size not found"
    });

    }
    return response.status(200).json({
      success: true,
      error: false,
      data: productSize
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}


export async function getAllProductsByCatId(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000;

    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return response.status(404).json({
        message: "Page not found",
        error: true,
        success: false,
      });
    }
    const products = await ProductModel.find({ catId: request.params.id })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();
    if (!products) {
      return response.status(500).json({
        message: "Products not found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      success: true,
      error: false,
      datas: products,
      page: page,
      totalPages: totalPages,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function getAllProductsByCatName(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000;

    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return response.status(404).json({
        message: "Page not found",
        error: true,
        success: false,
      });
    }
    const products = await ProductModel.find({ catName: request.query.catName })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();
    if (!products) {
      return response.status(500).json({
        message: "Products not found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      success: true,
      error: false,
      datas: products,
      page: page,
      totalPages: totalPages,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function getAllProductsBySubCatId(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000;

    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return response.status(404).json({
        message: "Page not found",
        error: true,
        success: false,
      });
    }
    const products = await ProductModel.find({ subCatId: request.params.id })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();
    if (!products) {
      return response.status(500).json({
        message: "Products not found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      success: true,
      error: false,
      datas: products,
      page: page,
      totalPages: totalPages,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function getAllProductsBySubCatName(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000;

    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return response.status(404).json({
        message: "Page not found",
        error: true,
        success: false,
      });
    }
    const products = await ProductModel.find({
      subCat: request.query.subCatName,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();
    if (!products) {
      return response.status(500).json({
        message: "Products not found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      success: true,
      error: false,
      datas: products,
      page: page,
      totalPages: totalPages,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
export async function getAllProductsByThirdLevelCatId(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000;

    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return response.status(404).json({
        message: "Page not found",
        error: true,
        success: false,
      });
    }
    const products = await ProductModel.find({
      thirdSubCatId: request.params.id,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();
    if (!products) {
      return response.status(500).json({
        message: "Products not found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      success: true,
      error: false,
      datas: products,
      page: page,
      totalPages: totalPages,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function getAllProductsByThirdLevelCatName(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000;

    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return response.status(404).json({
        message: "Page not found",
        error: true,
        success: false,
      });
    }
    const products = await ProductModel.find({
      thirdSubCat: request.query.thirdSubCatName,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();
    if (!products) {
      return response.status(500).json({
        message: "Products not found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      success: true,
      error: false,
      datas: products,
      page: page,
      totalPages: totalPages,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function getAllProductsByPrice(request, response) {
  try {
    let productList = [];

    if (request.query.catId !== "" && request.query.catId !== undefined) {
      const productListArr = await ProductModel.find({
        catId: request.query.catId,
      }).populate("category");
      productList = productListArr;
    }

    if (request.query.subCatId !== "" && request.query.subCatId !== undefined) {
      const productListArr = await ProductModel.find({
        subCatId: request.query.subCatId,
      }).populate("category");
      productList = productListArr;
    }
    if (
      request.query.thirdSubCatId !== "" &&
      request.query.thirdSubCatId !== undefined
    ) {
      const productListArr = await ProductModel.find({
        thirdSubCatId: request.query.thirdSubCatId,
      }).populate("category");
      productList = productListArr;
    }
    console.log(productList);

    const filterProducts = productList.filter((product) => {
      if (
        request.query.minPrice &&
        product.price < parseInt(request.query.minPrice)
      ) {
        return false;
      }
      if (
        request.query.maxPrice &&
        product.price > parseInt(request.query.maxPrice)
      ) {
        return false;
      } else return true;
    });

    return response.status(200).json({
      success: true,
      error: false,
      products: filterProducts,
      totalPages: 0,
      page: 0,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function getAllProductsByRating(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000;

    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return response.status(404).json({
        message: "Page not found",
        error: true,
        success: false,
      });
    }
    let products;

    if (request.query.subCatId !== undefined) {
      products = await ProductModel.find({
        rating: request.query.rating,
        catId: request.query.subCatId,
      })
        .populate("category")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
    }
    if (request.query.catId !== undefined) {
      products = await ProductModel.find({
        rating: request.query.rating,
        subCatId: request.query.catId,
      })
        .populate("category")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
    }
    if (request.query.thirdSubCatId !== undefined) {
      products = await ProductModel.find({
        rating: request.query.rating,
        thirdSubCatId: request.query.thirdSubCatId,
      })
        .populate("category")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
    }

    if (!products) {
      return response.status(500).json({
        message: "Products not found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      success: true,
      error: false,
      datas: products,
      page: page,
      totalPages: totalPages,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function getAllProductsCount(request, response) {
  try {
    const products = await ProductModel.countDocuments();

    if (!products) {
      return response.status(500).json({
        message: "Products not found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      success: true,
      error: false,
      products: products,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function getFeaturedProducts(request, response) {
  try {
    const products = await ProductModel.find({ isFeatured: true }).populate(
      "category"
    );
    console.log(products);
    if (!products) {
      return response.status(500).json({
        message: "Products not found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      success: true,
      error: false,
      datas: products,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function deleteProduct(request, response) {
  try {
    console.log(true, request.params.id);
    const product = await ProductModel.findById(request.params.id).populate(
      "category"
    );
    console.log(product);
    if (!product) {
      return response.status(500).json({
        message: "Products not found",
        error: true,
        success: false,
      });
    }

    let images = product.images;
    let img = "";
    for (img of images) {
      const imgUrl = img;
      const urlArr = imgUrl.split("/");
      const image = urlArr[urlArr.length - 1];
      const imageName = image.split(".")[0];
      if (imageName) {
        const res = await cloudinary.uploader.destroy(
          imageName,
          (error, result) => {}
        );
      }
    }

    const deleteProduct = await ProductModel.findByIdAndDelete(
      request.params.id
    );

    if (!deleteProduct) {
      return response.status(500).json({
        message: "Products not found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      success: true,
      error: false,
      message: "Produc deleted successfully",
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function deleteProductRAMS(request, response) {
  try {
    const deleteProduct = await ProductRAMSModel.findByIdAndDelete(
      request.params.id
    );

    console.log(deleteProduct)
    if (!deleteProduct) {
      return response.status(500).json({
        message: "Product RAMS not found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      success: true,
      error: false,
      message: "Product RAMS deleted successfully",
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function deleteProductWeight(request, response) {
  try {
    const deleteProductweight = await ProductWeightModel.findByIdAndDelete(
      request.params.id
    );

    if (!deleteProductweight) {
      return response.status(500).json({
        message: "Product Weight not found",
        error: true,
        success: false,
      });
    }
    return response.status(200).json({
      success: true,
      error: false,
      message: "Product Weight deleted successfully",
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function deleteProductSize(request, response) {
  try {
    const deleteProductSize = await ProductSizeModel.findByIdAndDelete(
      request.params.id
    );

    if (!deleteProductSize) {
      return response.status(500).json({
        message: "Product size not found",
        error: true,
        success: false,
      });
    }
    return response.status(200).json({
      success: true,
      error: false,
      message: "Product size deleted successfully",
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}


export async function getSingleProduct(request, response) {
  try {
    const product = await ProductModel.findById(
      request.params.id.trim()
    ).populate("category");
    if (!product) {
      return response.status(500).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      success: true,
      error: false,
      datas: product,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function getSingleProductRAMS(request, response) {
  try {
    const productRAM = await ProductRAMSModel.findById(
      request.params.id.trim()
    )
    if (!productRAM) {
      return response.status(500).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      success: true,
      error: false,
      datas: productRAM,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function getSingleProductWeight(request, response) {
  try {
    const productWeight = await ProductWeightModel.findById(
      request.params.id.trim()
    )
    if (!productWeight) {
      return response.status(500).json({
        message: "Product Weight not found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      success: true,
      error: false,
      datas: productWeight,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function getSingleProductSize(request, response) {
  try {
    const productSize = await ProductSizeModel.findById(
      request.params.id.trim()
    )
    if (!productSize) {
      return response.status(500).json({
        message: "Product Size not found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      success: true,
      error: false,
      datas: productSize,
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
  try {
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
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function removeBannerImageFromCloudinary(request, response) {
  try {
    const imgUrl = request.query.img;
    const urlArr = imgUrl.split("/");
    const image = urlArr[urlArr.length - 1];
    const imageName = image.split(".")[0];
    const publicId = `bannerimages/${imageName}`
    if (imageName) {
      const res = await cloudinary.uploader.destroy(
        publicId,
        (error, result) => {}
      );
      if (res) {
        return response.status(200).send(res);
      }
    }
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}


export async function updatedProduct(request, response) {
  try {
    const product = await ProductModel.findByIdAndUpdate(
      request.params.id,
      {
        name: request.body.name,
        description: request.body.description,
        images: request.body.images,
        brand: request.body.brand,
        price: request.body.price,
        oldPrice: request.body.oldPrice,
        catName: request.body.catName,
        catId: request.body.catId,
        category: request.body.category,
        subCatId: request.body.subCatId,
        subCat: request.body.subCat,
        thirdSubCat: request.body.thirdSubCat,
        thirdSubCatId: request.body.thirdSubCatId,
        countInStock: request.body.countInStock,
        rating: request.body.rating,
        isFeatured: request.body.isFeatured,
        discount: request.body.discount,
        productRam: request.body.productRam,
        size: request.body.size,
        productWeight: request.body.productWeight,
        bannerImages : request.body.bannerImages,
        bannerTitleName: request.body.bannerTitleName,
        isDisplayOnBanner: request.body.isDisplayOnBanner
      },
      { new: true }
    );
    if (!product) {
      return response.status(404).json({
        message: "Product can not be updated",
        error: true,
        success: false,
      });
    }
    // imagesArr = [];

    return response.status(200).json({
      message: "Product updated",
      success: true,
      error: false,
      data: product,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}


export async function updatedProductRAMS(request, response) {
  try {
    const productRAMS = await ProductRAMSModel.findByIdAndUpdate(
      request.params.id,
      {
        name: request.body.name,
      },
      { new: true }
    );
    if (!productRAMS) {
      return response.status(404).json({
        message: "Product RAMS can not be updated",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Product RAMS updated",
      success: true,
      error: false,
      data: productRAMS,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function updatedProductWeight(request, response) {
  try {
    const productWeight = await ProductWeightModel.findByIdAndUpdate(
      request.params.id,
      {
        name: request.body.name,
      },
      { new: true }
    );
    if (!productWeight) {
      return response.status(404).json({
        message: "Product Weight can not be updated",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Product Weight updated",
      success: true,
      error: false,
      data: productWeight,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function updatedProductSize(request, response) {
  try {
    const productSize = await ProductSizeModel.findByIdAndUpdate(
      request.params.id,
      {
        name: request.body.name,
      },
      { new: true }
    );
    if (!productSize) {
      return response.status(404).json({
        message: "Product Size can not be updated",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Product Size updated",
      success: true,
      error: false,
      data: productSize,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function deleteMultipleProduct(request, response) {
  try {
    console.log(true,request.body)
    const { ids } = request.body;
    if (!ids || !Array.isArray(ids)) {
      return response.status(400).json({
        message: "Invalid input",
        error: true,
        success: false,
      });
    }

    for (let i = 0; i < ids.length; i++) {
      const product = await ProductModel.findById(ids[i]);
      const images = product.image;
      let img = "";

      for (let img of images) {
        const imgUrl = img;
        const urlArr = imgUrl.split("/");
        const image = urlArr[urlArr.length - 1];
        const imageName = image.split(".")[0];
        if (imageName) {
          const res = await cloudinary.uploader.destroy(
            imageName,
            (error, result) => {}
          );
        }
      }


    }
    await ProductModel.deleteMany({_id: {$in: ids}})
     return response.status(200).json({
      message: "Products deleted successfully",
      error: true,
      success: false,
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}


export async function sortBy(request, response) {

  
  try {
    const {products, sortBy, order} = request.body;
    const sortitem = sortItem([...products], sortBy, order);
      return response.status(200).json({
      error: false,
      success: true,
      products: sortitem,
      page: 0,
      totalPages: 0
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
  
}

const sortItem= (products, sortBy, order)=>{
  return [...products].sort((a,b)=>{
    if(sortBy === 'name') {
      console.log('15',a.name,b.name)
      return order === 'asc'? a.name.localeCompare(b.name):
      b.name.localeCompare(a.name)
    }
    if(sortBy === 'price'){
      console.log('11',sortBy, order,a.price- b.price)
      return order==='asc'? a.price-b.price: b.price-a.price
    }
    return;
  })
}

export async function productsCount(request, response) {

  
  try {
    const count =await ProductModel.countDocuments();
      return response.status(200).json({
      error: false,
      success: true,
      count: count
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
  
}

