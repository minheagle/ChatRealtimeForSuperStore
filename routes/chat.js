import express from "express";
import {
  createChat,
  userChats,
  findChat,
} from "../controllers/chatController.js";

const router = express.Router();

router.post("/create", createChat);
router.get("/:userId", userChats);
router.get("/find/:firstId/:secondId", findChat);

export default router;
