import { Server as SocketIoServer } from "socket.io";
import Message from "./models/MessagesModel.js";

import Channel from "./models/ChannelModel.js";

const setupSocket = (server) => {
  const io = new SocketIoServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  const disconnect = (socket) => {
    console.log(`Client Disconnected: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };
  const sendMessage = async (message) => {
    const senderSocketId = userSocketMap.get(message.sender);
    const recipientSocketId = userSocketMap.get(message.recipient);

    const createdMessage = await Message.create(message);
    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id email firstName lastName image color")
      .populate("recipient", "id email firstName lastName image color");

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receiveMessage", messageData);
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveMessage", messageData);
    }
  };
  const sendChannelMessage = async (message) => {
    try {
      if (!message.channelId || !message.sender || !message.content) {
        console.error(
          "sendChannelMessage: Missing required properties",
          message
        );
        return;
      }

      //  Create and save the message in MongoDB
      const createMessage = await Message.create({
        sender: message.sender,
        channelId: message.channelId,
        content: message.content,
        messageType: message.messageType,
        timestamp: new Date(),
      });

      //  Ensure messages are pushed into the channel
      const updatedChannel = await Channel.findByIdAndUpdate(
        message.channelId,
        { $push: { messages: createMessage._id } },
        { new: true, useFindAndModify: false } //  Ensures updated data is returned
      );

      if (!updatedChannel) {
        console.error("Channel not found:", message.channelId);
        return;
      }

      //  Populate sender details
      const messageData = await Message.findById(createMessage._id)
        .populate("sender", "id email firstName lastName image color")
        .exec();

      //  Emit message to all channel members
      const finalData = { ...messageData._doc, channelId: updatedChannel._id };
      updatedChannel.members.forEach((member) => {
        const memberSocketId = userSocketMap.get(member._id.toString());
        if (memberSocketId) {
          io.to(memberSocketId).emit("receive-channel-message", finalData);
        }
      });

      // Emit to admin
      const adminSocketId = userSocketMap.get(updatedChannel.admin.toString());
      if (adminSocketId) {
        io.to(adminSocketId).emit("receive-channel-message", finalData);
      }
    } catch (error) {
      console.error("Error in sendChannelMessage:", error);
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User Connected: ${userId} (Socket ID: ${socket.id})`);
    } else {
      console.log("User ID not provided during connection.");
    }
    socket.on("sendMessage", sendMessage);
    socket.on("send-channel-message", sendChannelMessage);
    socket.on("disconnect", () => disconnect(socket));
  });
};

export default setupSocket;
