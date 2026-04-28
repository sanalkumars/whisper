import { Router } from "express";
import { authCallBack, getMe } from "../controllers/userController";
import { protectedRoute } from "../middleware/auth";


const router = Router()

router.get('/me',protectedRoute,getMe)

router.get('/callback',authCallBack)

export default router