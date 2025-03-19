import Message from "../models/MessagesModel.js";
import Channel from "../models/ChannelModel.js";

export const getMessages = async (request, response) => {
  try {
    const user1 = request.userId;
    const chatId = request.body.id;
    const chatType = request.body.chatType;
    if (!chatId) {
      return response.status(400).json({ error: "Chat ID is required" });
    }

    let messages = [];

    if (chatType === "contact") {
      //  Fetch Direct Messages (DMs)
      messages = await Message.find({
        $or: [
          { sender: user1, recipient: chatId },
          { sender: chatId, recipient: user1 },
        ],
      })
        .populate("sender", "id email firstName lastName image color")
        .populate("recipient", "id email firstName lastName image color")
        .sort({ timestamp: 1 });
    } else if (chatType === "channel") {
      //  Fetch Channel Messages
      messages = await Message.find({ channelId: chatId })
        .populate("sender", "id email firstName lastName image color")
        .sort({ timestamp: 1 });
    }

    return response.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
};
