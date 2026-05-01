import type { NextFunction, Response } from "express";
import type { AuthReq } from "../middleware/auth";
import { Chat } from "../models/ChatModel";
import { Types } from "mongoose";



export async function getChats(req: AuthReq, res: Response, next: NextFunction) {

  try {
    const userId = req.userId;
    //  this will include current user , which is not needed
    const chats = await Chat.find({ participants: userId })
      .populate("participants", "name email avatar")
      .populate("lastMessage")
      .sort({ lastMessageAt: -1 });

    const formattedChats = chats.map((chat) => {
      const otherParticipant = chat.participants.find((p) => p._id.toString() !== userId);

      return {
        _id: chat._id,
        participants: otherParticipant ?? null,
        lastMessage: chat.lastMessage,
        lastMessageAt: chat.lastMessageAt,
        createdAt: chat.createdAt
      }
    });

    res.json(formattedChats);

  } catch (error) {
    res.status(500)
    next(error)
  }

}

export async function getOrCreateChat(req: AuthReq, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    const participantId = req.params.participantId as string; // ✅ cast here

    if (!participantId) {
      return res.status(400).json({ message: "Participant ID is Required" });
    }

    if (!Types.ObjectId.isValid(participantId)) {
      return res.status(400).json({ message: "Invalid Participant ID" });
    }

    if (userId === participantId) {
      return res.status(400).json({ message: "You Cannot Create A Chat With Yourself" });
    }

    let chat = await Chat.findOne({
      participants: { $all: [userId, participantId] }
    })
      .populate("participants", "name email avatar")
      .populate("lastMessage")
      .sort({ lastMessageAt: -1 });

    if (!chat) {
      const newChat = new Chat({ participants: [userId, participantId] });
      await newChat.save();
      chat = await newChat.populate("participants", "name email avatar");
    }

    const otherParticipant = chat.participants.find(
      (p: any) => p._id.toString() !== userId
    );

    res.json({
      _id: chat._id,
      participants: otherParticipant ?? null,
      lastMessage: chat.lastMessage,
      lastMessageAt: chat.lastMessageAt,
      createdAt: chat.createdAt,
    });

  } catch (error) {
    res.status(500);
    next(error);
  }
}