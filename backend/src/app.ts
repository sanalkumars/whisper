import express from 'express';


import authRoute from './routes/authRoute'
import chatRoute from './routes/chatRoute'
import userRoute from './routes/userRoute'
import messageRoute from './routes/messageRoute'
import { clerkMiddleware } from '@clerk/express'
import { errorHandler } from './middleware/errorHandler';



const app = express();

app.use(express.json());
app.use(clerkMiddleware());


app.get('/health', (req, res) => {
    res.json({ status: 'OK', message:" Server is running " });
});

app.use('/api/auth',authRoute)
app.use('/api/chats',chatRoute)
app.use('/api/messages',messageRoute)
app.use('/api/users',userRoute)

// This will call the error handler after all the routes and other middleware to catch the error 
// passed with next(error)
app.use(errorHandler);

export default app;