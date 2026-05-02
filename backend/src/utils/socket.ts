
import  { Socket , Server as SocketServer } from "socket.io"
import { Server as HttpServer } from "http";
import { verifyToken } from "@clerk/express";
import { Message } from "../models/MessageModel";
import { Chat } from "../models/ChatModel";
import { User } from "../models/UserModel";

interface SocketWithUserID extends Socket {
    userId : string ;
}

// online users will be stored as a map key is userId & value is socketid

export const onlineUsers : Map<string ,string> = new Map()

export const initializeSocket = ( httpServer : HttpServer)=>{

    const allowedOrigins =[
        "http://localhost:8081" , //mobile app
        process.env.FRONTEND_URL as string 
    ]

    const io = new SocketServer(httpServer ,{
        cors: { origin : allowedOrigins}
    });

    // verify the socket connection

    io.use( async( socket , next)=>{
        const token = socket.handshake.auth.token //send by the client
        if( !token ) return next( new Error("Authentication Error"));
        try {
            const session = await verifyToken(token , { secretKey : process.env.CLERK_SECRET_KEY!});

            const clerkId = session.sub;

            const user = await User.findOne({ clerkId});
            if( !user ) return next( new Error("User Not Found"));

            ( socket as SocketWithUserID ).userId = user._id.toString();
            next();

        } catch (error:any) {
            next( new Error(error));
        }
    })

// this event name is strict and used when a new user connect to the server
    io.on("connection" , ( socket) =>{

        const userId = (socket as SocketWithUserID).userId;

        // sending list of online users after connection
        socket.emit("online-users" , { userIds : Array.from(onlineUsers.keys())});

        // stores the new user in the map 
        onlineUsers.set( userId,socket.id );

        // notify others user that this user is online 
        socket.broadcast.emit("user-online" , { userId});

        socket.join(`user:${userId}`);

        socket.on("join-chat" , ( chatId :string )=>{
            socket.join(`chat:${chatId}`)
        })

        socket.on("leave-chat" , ( chatId :string )=>{
            socket.leave(`chat:${chatId}`)
        })


        // handle messages sending 

        socket.on("send-message", async( data : { chatId : string,text : string})=>{
            try {
                const { chatId , text} = data;

                const chat = await Chat.findOne({
                     _id : chatId ,
                    participants : userId
                 });

                 if(!chat){
                    socket.emit("socker-error",{ message : "Chat not Found"})
                    return;
                }

                const message = await Message.create({
                    chat : chatId,
                    sender : userId,
                    content : text 
                });

                // update the last message 
                chat.lastMessage = message._id;
                chat.lastMessageAt = new Date();
                await chat.save()

                await message.populate( "sender" , "name email avatar");

                // sending the meesage to the user in real time 

                io.to(`chat:${chatId}`).emit("new-message",message);

                for( const participantId of chat.participants){
                    io.to(`user:${participantId}`).emit("new-message",message)
                }

            } catch (error) {
                 
                    socket.emit("socker-error",{ message : "Failed to send the message"})
                    return;
                
            }
        })


        // todo
        socket.on("typing", async(data)=>{

        })

        socket.on("disconnect",()=>{
            onlineUsers.delete(userId);

            socket.broadcast.emit("user-offline",{ userId})
        })

    });
    return io;

}


