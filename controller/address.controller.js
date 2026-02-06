import AddressModel from '../model/address.model.js';
import UserModel from '../model/user.model.js';


export async function addAddressController(request, response) {
    try {
        const {address_line, city, state, pincode, country, mobile, status, landMark, addressType} = request.body;
        const userId = request.userId
        console.log('1112',request.body)
        console.log('userId: ',userId)
        if(!address_line || !city || !state || !pincode || !country || !mobile || !userId || !landMark || !addressType ||!status){
            return response.status(404).json(
                {
                    message: "Provide all the fields ",
                    error: true,
                    success: false
                }
            )


        }

        const address = new AddressModel(
            {address_line,city, state,pincode,country,mobile,status,userId, landMark, addressType}
        )

        const saveAddress =await address.save();

        const updateCartUser = await UserModel.updateOne(
            {_id: userId},
            {
                $push: {
                    address_details: saveAddress?._id
                                    }
            }

        )
        console.log(saveAddress)

            return response.status(200).json(
                {
                    message: "Address added successfully" ,
                    error: false,
                    success: true,
                    data: saveAddress
                }
            )


    }catch(error) {
            return response.status(500).json(
                {
                    message: error.message,
                    error: true,
                    success: false
                }
            )

    }
}

export async function editAddressController(request, response) {
    try {

        const id = request.params.id;
        console.log('rr',request.userId);
        console.log('dd',request.body);
        const {address_line, city, state, pincode, country, mobile, status, landMark, addressType} = request.body;
        const userId = request.userId
       
        if(!address_line || !city || !state || !pincode || !country || !mobile || !userId || !landMark || !addressType){
            return response.status(404).json(
                {
                    message: "Provide all the fields ",
                    error: true,
                    success: false
                }
            )


        }

        const updatedAddress =await AddressModel.findByIdAndUpdate(id,
            {
                          address_line,city, state,pincode,country,mobile,status,userId, landMark, addressType
  
            },{new: true}
        )
        if(!updatedAddress){
             return response.status(500).json({
                success: false,
                error: true,
                message: "Address can not updated"
            })
        }
            return response.status(200).json(
                {
                    message: "Address updated successfully" ,
                    error: false,
                    success: true,
                    data: updatedAddress
                }
            )


    }catch(error) {
            return response.status(500).json(
                {
                    message: error.message,
                    error: true,
                    success: false
                }
            )

    }
}

export async function deleteAddressController(request, response) {
    try {

        const id = request.params.id;

       const deleteAddress= await AddressModel.findByIdAndDelete(id)
        if(!deleteAddress){
             return response.status(500).json({
                success: false,
                error: true,
                message: "Address can not deleted"
            })
        }
            return response.status(200).json(
                {
                    message: "Address deleted successfully" ,
                    error: false,
                    success: true,
                }
            )


    }catch(error) {
            return response.status(500).json(
                {
                    message: error.message,
                    error: true,
                    success: false
                }
            )

    }
}

export async function getAddressController(request, response) {
    try {
        const address = await AddressModel.findById(request.params.id)

        if(!address){
             return response.status(404).json(
                {
                    message: "Address not found ",
                    error: true,
                    success: false
                }
            )

        }
           
            return response.status(200).json(
                {
                    message: "success",
                    error: false,
                    success: true,
                    address:address
                }
            )


    }catch(error) {
            return response.status(500).json(
                {
                    message: error.message,
                    error: true,
                    success: false
                }
            )

    }
}

export async function getAllAddressController(request, response) {
    try {

        const address = await AddressModel.find()
        if(!address){
             return response.status(404).json(
                {
                    message: "Address not found ",
                    error: true,
                    success: false
                }
            )

        }
           
            return response.status(200).json(
                {
                    message: "success",
                    error: false,
                    success: true,
                    address:address
                }
            )


    }catch(error) {
            return response.status(500).json(
                {
                    message: error.message,
                    error: true,
                    success: false
                }
            )

    }
}