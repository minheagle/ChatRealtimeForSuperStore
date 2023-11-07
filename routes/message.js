import express from "express";
import { addMessage, getMessages } from "../controllers/messageController.js";

const router = express.Router();

router.post("/add-message/", addMessage);
router.get("/get-message/:chatId", getMessages);

export default router;
