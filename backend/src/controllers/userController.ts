import type { NextFunction, Request, Response } from "express";
import type { AuthReq } from "../middleware/auth";
import { User } from "../models/UserModel";
import { clerkClient, getAuth } from "@clerk/express";




export async function getMe(req: AuthReq, res: Response , next :NextFunction) {

    try {

        const userId = req.userId;

        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ message: "User Not Found" })
        }

        return res.status(200).json(user)

    } catch (error) {
        console.log("error occured is", error)
        res.status(500)
        next(error);
    }

}

export async function authCallBack(req: Request, res: Response , next :NextFunction) {
    try {
        const { userId: clerkId } = getAuth(req);
        if (!clerkId) {
            return res.status(401).json({ message: "Unautherized" })
        }

        let user = await User.findOne({ clerkId });

        if (!user) {
            // get the user info from the clerk and save it in the DB
            const clerkUser = await clerkClient.users.getUser(clerkId);

            user = await User.create({
                clerkId,
                name: clerkUser.firstName ? `${clerkUser.firstName}${clerkUser.lastName || ""}`.trim()
                    : clerkUser.emailAddresses[0]?.emailAddress?.split("@")[0],
                email: clerkUser.emailAddresses[0]?.emailAddress,
                avatar : clerkUser.imageUrl

            })
        }

        res.json(user)
    } catch (error) {
        console.log("error occured is", error)
        res.status(500)
        next(error)
    }
}