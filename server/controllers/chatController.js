import Chat from "../models/Chat.js";

//API Controller for creating a new chat
export const createChat = async (req, res) => {
  try {
    const userId = req.user._id;

    const chatData = {
      userId,
      messages: [],
      name: "New Chat",
      userName: req.user.name,
    };

    await Chat.create(chatData);
    res.json({ success: true, message: "Chat created" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//API controller for getting all chats
export const getChats = async (req, res) => {
  try {
    const userId = req.user._id;
    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });

    res.json({ success: true, chats });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//API controller for deleting chat
// API Controller for creating a new chat with the first message
export const createChatWithMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.json({ success: false, message: "Prompt is required" });
    }

    const chatData = {
      userId,
      messages: [
        {
          role: "user",
          content: prompt,
          timestamp: Date.now(),
          isImage: false,
        },
      ],
      name: prompt.slice(0, 40),
      userName: req.user.name,
    };

    const newChat = await Chat.create(chatData);
    res.json({ success: true, message: "Chat created", chat: newChat });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//API controller for getting a single chat by ID
export const getChatById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId } = req.params;

    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) {
      return res.json({ success: false, message: "Chat not found" });
    }

    res.json({ success: true, chat });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//API controller for deleting chat
export const deleteChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId } = req.body;

    await Chat.deleteOne({ _id: chatId, userId });

    res.json({ success: true, message: "Chat Deleted" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
