import MyListModel from '../model/mylist.model.js';

export async function addToMyListController(request, response) {

    try {
        const userId = request.userId;

        const {
            productId,
            productTitle,
            image,
            rating,
            price,
            oldPrice,
            brand,
            discount,
        }=request.body;

        const item = await MyListModel.findOne(
            {userId: userId, productId}
        )
        if(item){
            return response.status(400).json({
                message: "Item already in my list"
            })
        }
        const myList = await new MyListModel(
            {
                productId,
                productTitle,
                image,
                rating,
                price,
                oldPrice,
                brand,
                discount,
                userId,
                image,
            }
        )

        const save = await myList.save();
        return response.status(200).json(
            {
                error: false,
                success: true,
                message: "The product saved in the my list"
            }
        )
    } catch (error) {
        return response.status(200).json(
            {
                message: error.message || error,
                error: false,
                success: true,
                
            }
        )
    }
    
}

export async function deleteToMyListController(request, response) {

    try {
        const id = request.params.id;
        

        const myListItem = await MyListModel.findById(id)
        if(!myListItem){
            return response.status(404).json({
                error: true,
                success: false,
                message: "The item with this given id was not found "
            })
        }

        const deleteItem = await MyListModel.findByIdAndDelete(
        id
        )

        if(!deleteItem){
             return response.status(404).json(
            {
                error: true,
                success: false,
                message: "The item is not deleted"
            }
        )
        }
        return response.status(200).json(
            {
                error: false,
                success: true,
                message: "The Item removed from my List"
            }
        )
    } catch (error) {
        return response.status(200).json(
            {
                message: error.message || error,
                error: false,
                success: true,
                
            }
        )
    }
    
}

export async function getMyListController(request, response) {

    try {
        const userId = request.userId;
        

        const myListItems = await MyListModel.find({userId: userId})
        if(!myListItems){
            return response.status(404).json({
                error: true,
                success: false,
                message: "Items not found in my List"
            })
        }

        return response.status(200).json(
            {
                error: false,
                success: true,
                data: myListItems
            }
        )
    } catch (error) {
        return response.status(200).json(
            {
                message: error.message || error,
                error: false,
                success: true,
                
            }
        )
    }
    
}