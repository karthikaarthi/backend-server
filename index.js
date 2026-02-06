import express from 'express';
import dotenv from 'dotenv'
import connectDB from './connectDB.js';
import userRouter from './routes/user.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import categoryRouter from './routes/category.route.js';
import productRouter from './routes/product.route.js';
import cartRouter from './routes/cart.route.js';
import myListRouter from './routes/myList.route.js';
import addressRoute from './routes/address.route.js';
import homeBannerRouter from './routes/homeBannerslider.route.js';
import bannerV1Router from './routes/bannerV1.route.js';
import blogRouter from './routes/blog.route.js';
import orderRouter from './routes/order.route.js';

const app = express()


const PORT  = process.PORT || 8000

dotenv.config();
app.use(express.json());
app.use(cookieParser())
app.use(cors())
// app.use(cors({
//    origin: [
//     "http://localhost:5174",
//     "http://localhost:5173",
// ], // Vite frontend port
//   credentials: true
// }))

app.get("/", (request, response) =>{
    response.json({
        message: "Server is running "+ process.env.PORT
    })
} )


app.use('/api/user',userRouter);
app.use('/api/category',categoryRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/myList', myListRouter);
app.use('/api/address', addressRoute);
app.use('/api/homeBanner', homeBannerRouter);
app.use('/api/bannerV1', bannerV1Router);
app.use('/api/blog', blogRouter);
app.use('/api/order', orderRouter);

connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("Server is running",process.env.PORT || 8000)
    })
})