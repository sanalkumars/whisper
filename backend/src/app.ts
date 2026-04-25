import express from 'express';


import authRoute from './routes/authRoute'
import chatRoute from './routes/chatRoute'
import userRoute from './routes/userRoute'
import messageRoute from './routes/messageRoute'


const app = express();

app.use(express.json());


app.get('/health', (req, res) => {
    res.json({ status: 'OK', message:" Server is running " });
});

app.use('/api/auth',authRoute)
app.use('/api/chats',chatRoute)
app.use('/api/messages',messageRoute)
app.use('/api/users',userRoute)

export default app;