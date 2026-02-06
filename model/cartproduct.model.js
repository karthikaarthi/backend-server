import mongoose, { mongo } from "mongoose";

const cartProductSchema = mongoose.Schema({

    productId: {
        type: String,
        required: true
    },
    productTitle: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    oldPrice: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    subTotal: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
    },
    size: {
        type: String,
    },
    weight: {
        type: String,
    },
    productRAM: {
        type: String,
    },
    brand: {
        type: String,
        required: true
    },
    countInStock: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
       required: true
    }
},{timestamps: true})


const CartProductModel = mongoose.model("cartProduct",cartProductSchema);
export default CartProductModel;