import type { NextFunction, Response } from "express";
import type { AuthReq } from "../middleware/auth";
import { Chat } from "../models/ChatModel";
import { Message } from "../models/MessageModel";

export async function getMessages(req: AuthReq, res: Response, next: NextFunction) {
    try {
        const { chatId } = req.params;
        const userId = req.userId;


        const chat = await Chat.findOne({
            _id: chatId,
            participants: userId
        });

        if (!chat) {
            return res.status(404).json({ message: "Chat Not Found" })
        }

        const messages = await Message.find({ chat: chatId })
            .populate("sender", "name email avatar")
            .sort({ createdAt: 1 });

        res.json(messages)

    } catch (error) {
        res.status(500);
        next(error)
    }
}
