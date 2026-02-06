import CartProductModel  from '../model/cartproduct.model.js'
import UserModel from '../model/user.model.js'

export async function addTocartItemController (request, response) {

    try {
        // const userId = request.userId;
        console.log('object',request.body)
        const {productId, productTitle,image, rating, price, oldPrice, quantity, subTotal, discount, size, weight, productRAM, brand, countInStock, userId} = request.body;
        console.log('s',userId)
        if(!productId) {
            return  response.status(402).json({
            message: "Provide product id",
            error:  true,
            success: false
        }) 
        }

        const checkItemCart = await CartProductModel.findOne(
            {
                userId: userId,
            
            productId: productId}   
        )
        if(checkItemCart) {
            return response.status(400).json(
                {
                    message: "Item already in the cart"
                }
            )
        }

        const cartItem =await new CartProductModel(
            {
               productId,
               productTitle,
               image,
               rating,
               price,
               oldPrice,
               quantity,
               subTotal,
               discount,
                size,
                weight,
                productRAM,
                 brand,
                  countInStock,
                   userId
            }
        )
       const save = await cartItem.save();

    

       return response.status(200).json(
        {
            data: save,
            message: "Item added successfully",
            error: false,
            success: true
        }
       )
    } catch (error) {
            return  response.status(500).json({
            message: error.message || error,
            error:  true,
            success: false
        })
    }
    
}
  

export async function getTocartItemController (request, response) {

    try {
        const userId = request.userId;
        const cartItem = await CartProductModel.find(
            {userId: userId}
        ).populate('productId') 

        return response.status(200).json(
            {
                success: true,
                error: false,
                data: cartItem
            }
        )
    } catch (error) {
          return  response.status(500).json({
            message: error.message || error,
            error:  true,
            success: false
        })
    }
}

export async function updateTocartItemQtyController (request, response) {

    try {
        const userId = request.userId;
        console.log(request.body)
        const {id, quantity, subTotal, size, weight, ram} = request.body;
        if(!id || !quantity) {
             return response.status(404).json(
            {
                success: false,
                error: true,
                message: "Provide id and quantity"
            }
        )
        }
        const updatedItem = await CartProductModel.updateOne(
            {
                _id: id,
                userId: userId
            },
            {
                quantity:quantity,
                subTotal,
                size,
                productRAM: ram,
                weight

            },{new: true}
        )
        return response.status(200).json(
            {
                message: " Updated successfully",
                success: true,
                error: false,
                
            }
        )
    } catch (error) {
          return  response.status(500).json({
            message: error.message || error,
            error:  true,
            success: false
        })
    }
}

export async function deleteTocartItemQtyController (request, response) {

    try {
        console.log('sd',request.params.id)
        const userId = request.userId;
        const cartItemId = request.params.id;
        if(!cartItemId ) {
             return response.status(404).json(
            {
                success: false,
                error: true,
                message: "Provide _id "
            }
        )
        }
        const deleteItem = await CartProductModel.findOneAndDelete(
            {
                _id: cartItemId,
                userId: userId
            },
           
        )
       if(!deleteItem){
         return response.status(404).json(
            {
                success: false,
                error: true,
                message: "Cart is not found "
            }
        )
       }
 
        return response.status(200).json(
            {
                message: " Item removed",
                success: true,
                error: false,
                
            }
        )
    } catch (error) {
          return  response.status(500).json({
            message: error.message || error,
            error:  true,
            success: false
        })
    }
}


export async function deleteTocartItems (request, response) {

    try {
        const userId = request.userId;
       
        const deleteItems = await CartProductModel.deleteMany(
           {userId}
           
        )
       if(!deleteItems){
         return response.status(404).json(
            {
                success: false,
                error: true,
                message: "No Cart items found "
            }
        )
       }
 
        return response.status(200).json(
            {
                message: " Items removed",
                success: true,
                error: false,
                
            }
        )
    } catch (error) {
          return  response.status(500).json({
            message: error.message || error,
            error:  true,
            success: false
        })
    }
}


