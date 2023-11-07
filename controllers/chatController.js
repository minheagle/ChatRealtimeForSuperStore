import Chat from "../models/chatModel.js";

export const createChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      members: { $all: [req.body.senderId, req.body.receiverId] },
    });
    if (!chat) {
      const newChat = new Chat({
        members: [req.body.senderId, req.body.receiverId],
      });
      const result = await newChat.save();
      res.status(200).json(result);
    } else {
      res.status(200).json(chat);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const userChats = async (req, res) => {
  try {
    const chat = await Chat.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const findChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};
