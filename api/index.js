import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import postRoutes from './routes/post.routes.js';
import cookieParser from 'cookie-parser';
import commentRoutes from './routes/comment.route.js';
import jobRoutes from './routes/job.routes.js';
import courseRoutes from './routes/course.routes.js';
import applyRoutes from './routes/apply.routes.js';

dotenv.config();

mongoose.connect( process.env.MONGO)
.then( ()=>{
        console.log('MongoDB is connected');
    }
).catch((err) =>{
    console.log(err);
});

const app = express();

app.use(express.json());
app.use(cookieParser());

app.listen(3000, ()=>{
    console.log('Server is running on port 3000');
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/job', jobRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/apply', applyRoutes);

app.use((err, req, res, next) =>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    })
});