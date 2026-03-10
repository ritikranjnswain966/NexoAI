import express from "express";
import {
  createChat,
  createChatWithMessage,
  deleteChat,
  getChatById,
  getChats,
} from "../controllers/chatController.js";
import { protect } from "../middlewares/auth.js";

const chatRouter = express.Router();

chatRouter.get("/create", protect, createChat);
chatRouter.post("/create-with-message", protect, createChatWithMessage);
chatRouter.get("/get", protect, getChats);
chatRouter.get("/:chatId", protect, getChatById);
chatRouter.post("/delete", protect, deleteChat);

export default chatRouter;
