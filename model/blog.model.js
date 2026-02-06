import mongoose from "mongoose"


const blogSchema = mongoose.Schema(
    {
        title: {
            type: String,
            default:''
        },
        images:[
            {
                type: String,
            }
        ],
        description: {
            type: String,
            default: ''
        },
       dateCreated: {
        type: Date,
        default: Date.now,
    }
    },
   {timestamps: true}
)

const BlogModel = mongoose.model('blog',blogSchema);
export default BlogModel
