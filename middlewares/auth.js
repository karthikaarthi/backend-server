import { response } from "express"
import jwt from 'jsonwebtoken'


const auth = async (request,response, next)=>{
    try {


        let token =  request?.headers?.authorization?.split(' ')[1];

        if(!token ){
            token = request.query.token
        }

        if(!token) {
            return response.status(401).json({
                message: "Provide token"
            })
        }

        const decode =  jwt.verify(token,process.env.SECRET_KEY_ACCESS_TOKEN)
        console.log("amma",decode)
        if(!decode) {
            return response.status(401).json({
                message: "unauthorized access",
                error: true,
                success: false
            })
        }
        console.log("dd",decode)
        request.userId = decode.id
        next();
        

    }catch(error) {
        return  response.status(401).json({
            message: error.message || error,
            error:  true,
            success: false
        })
    }
}

export default auth