import { timeStamp } from 'console';
import mongoose from 'mongoose'


const productSizeSchema = mongoose.Schema(
    {
     name: {
            type: String,
            required: true
        },
        dateCreated: {
            type: Date,
            default: Date.now
        }
    }
    ,{
        timeStamp: true
    }
)

const ProductSizeModel = mongoose.model("productSize",productSizeSchema);
export default ProductSizeModel
;