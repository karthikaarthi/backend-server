import mongoose, { mongo } from "mongoose";

const addressSchema = mongoose.Schema({

    address_line: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    state: {
        type: String,
        default: ""
    },
    status: {
        type: Boolean,
        default: true
    },
    pincode: {
        type: String
    },
    country: {
        type: String
    },
    mobile: {
        type: Number,
        default: null
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref:"user",
        required: true
    },
    landMark: {
        type: String
    },
    addressType: {
        type: String,
        enum:["work","home"]
    }
},{timestamps: true})


const AddressModel = mongoose.model('address',addressSchema)

export default AddressModel;
