
import mongoose , { Schema , type Document} from "mongoose";

export interface IMessage extends Document {
    chat : mongoose.Types.ObjectId;
    sender : mongoose.Types.ObjectId;
    content : string;
    createdAt : Date;
    updatedAt : Date
}

const MessageSchema = new Schema<IMessage>({
    chat : {
        type : Schema.Types.ObjectId,
        ref : "Chat",
        required : true
    },
    sender : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    content : {
        type : String,
        required : true,
        trim : true
    }
},{
    timestamps : true
});

// index for faster retrieval of messages by chat , 1 from oldest to newest , -1 for newest to oldest
MessageSchema.index({ chat: 1, createdAt: 1 });

export const Message = mongoose.model<IMessage>("Message",MessageSchema)