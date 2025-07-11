import express from 'express';
import cookieParser from 'cookie-parser';
import AuthRouter from './src/routers/Auth.router.js';
import PostRouter from './src/routers/Post.router.js';
import connectToDB from './db.js';
import { fileURLToPath } from 'url';
import path from 'path';
import cors from 'cors'


connectToDB();
const app = express();
connectToDB();

app.use(cors({
    origin: 'https://photo-editor-haas.onrender.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
})); 


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../client/dist')));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

app.use(AuthRouter);
app.use(PostRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
