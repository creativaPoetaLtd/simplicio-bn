import express from "express";
import { getMessage, sendMessage } from "../controllers/message.controller.js";
import { isAuthenticated } from "../middlewares/isAdmin.js";

const router = express.Router();


router.post('/send-message', isAuthenticated, sendMessage)
router.get('/messages', isAuthenticated, getMessage)

export default router;