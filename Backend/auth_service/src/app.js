import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/authUserRoutes.js';
import adminRouter from './routes/authAdminRoutes.js';
import { consumeMessages } from './services/rabbitmqListener.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4044;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended : true }));


app.use((req, res, next) => {
    console.log(`Incoming request to ${req.url}`);
    next();
});
  

// Routes
app.use('/', userRouter);
app.use('/admin',adminRouter);


const exchange = 'user-exchange';
const routingKey = 'user.added';
consumeMessages(exchange, routingKey);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));


// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
