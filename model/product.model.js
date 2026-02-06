import mongoose  from "mongoose";


const productSchema = mongoose.Schema({
    name: {
        type: String,
        required : true,
    },
    description: {
        type: String,
        required: true
    },
    images: [
        {type: String,
            required: true
        }
    ],
        bannerImages: [
        {type: String,
            required: true
        }
    ],
     bannerTitleName: {
        type: String,
        required : true,
    },
    brand: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        default: 0
    },
    oldPrice: {
        type: Number,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category"
    },
    catName: {
        type: String,
        default: ''
    },
    catId: {
        type: String,
        default: ''
    },
    subCatId: {
        type: String,
        default: ''
    },
    subCat: {
        type: String,
        default: ''
    },
    thirdSubCatId: {
        type: String,
        default: ''
    },
    thirdSubCat: {
        type: String,
        default: ''
    },
    countInStock: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    discount: {
        type: Number,
        required: true,
    },
    productRam: [
        {type: String, default: ""}
    ],
    size: [
        {
            type: String,
            default: ""
        }
    ],
    productWeight: [
        {
            type: String,
            default: ""
        }
    ],
    dateCreated: {
        type: Date,
        default: Date.now,
    },
    isDisplayOnBanner: {
        type: Boolean,
        default: false
    }
},{timestamps: true})


const ProductModel = mongoose.model('product',productSchema);
export default ProductModel