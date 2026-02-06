import mongoose, { model } from "mongoose";


const myListSchema = mongoose.Schema(
    {
        productId: {
            type: String, 
            required: true
        },
        userId: {
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
        brand: {
            type: String,
            required: true
        },
        discount: {
            type: Number,
            required: true
        },
       
        
        
    },{timestamp: true}
)

const MyList = mongoose.model('myList',myListSchema);
export default MyList
