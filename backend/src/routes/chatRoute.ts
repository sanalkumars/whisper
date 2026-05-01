import { Router } from "express";
import { getChats, getOrCreateChat } from "../controllers/chatController";
import { protectedRoute } from "../middleware/auth";


const router = Router();
router.use(protectedRoute)

router.get('/',getChats);
router.post('/with/:participantId',getOrCreateChat);

export default router