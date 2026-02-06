import { timeStamp } from 'console';
import mongoose from 'mongoose'


const productRAMSSchema = mongoose.Schema(
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

const ProductRAMSModel = mongoose.model("productRAMS",productRAMSSchema);
export default ProductRAMSModel
;