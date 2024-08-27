import express from "express";
import { getConversationUsers, getMessage, sendMessage } from "../controllers/message.controller.js";
import { isAuthenticated } from "../middlewares/isAdmin.js";

const router = express.Router();


router.post('/send-message', isAuthenticated, sendMessage)
router.get('/messages', isAuthenticated, getMessage)
router.get('/conversation-users', isAuthenticated, getConversationUsers)
export default router;