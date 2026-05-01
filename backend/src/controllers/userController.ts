import type { NextFunction, Response } from "express";
import type { AuthReq } from "../middleware/auth";
import { User } from "../models/UserModel";




export async function getUsers( req :AuthReq , res:Response , next :NextFunction) {
    
    try {
        const userId = req.userId;

        const users = await User.find({ _id :{ $ne:userId } })
        .select("name email avatar")
        .limit(50);

        res.json(users);
    } catch (error) {
        res.status(500)
        next(error)
    }
}