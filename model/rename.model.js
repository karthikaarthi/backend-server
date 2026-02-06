import mongoose from "mongoose"


const reviewSchema = mongoose.Schema(
    {
        userName: {
            type: String,
            default:''
        },
        image:
            {
                type: String,
            }
    ,
        review: {
            type: String,
            default: ''
        },
        rating: {
        type: String,
        default: '',
    }
        ,
        userId: {
        type: String,
        default: '',
    }
        ,
        productId: {
        type: String,
        default: '',
    }

    },
   {timestamps: true}
)

const ReviewModel = mongoose.model('review',reviewSchema);
export default ReviewModel
