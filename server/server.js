import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'

import AuthRouter from './src/routers/Auth.router.js';
import PostRouter from './src/routers/Post.router.js';
import connectToDB from './db.js';


connectToDB();
const app = express();
connectToDB();
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
})); 

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

app.use(AuthRouter);
app.use(PostRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
