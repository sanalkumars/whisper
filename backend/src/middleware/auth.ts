import type { Request, Response, NextFunction } from 'express';
import { getAuth, requireAuth } from '@clerk/express';
import { User } from '../models/UserModel';


export type AuthReq = Request & {
    userId?: string
}

export const protectedRoute = [
    requireAuth(),
    async (req: AuthReq, res: Response, next: NextFunction) => {
        try {

            const { userId: clerkId } = getAuth(req);
        // this wont be necessery since clerk already do the check so commented it out

            // if (!clerkId) {
            //     return res.status(401).json({ message: 'Unauthorized' });
            // }

            const user = await User.findOne({ clerkId });

            if (!user) {
                return res.status(404).json({ message: " User Not Found " });
            }

            req.userId = user._id.toString();
            next();

        } catch (error) {
            console.log("Error occured in the auth middleware ", error)
            res.status(500)
            next(error)

        }
    }
]
