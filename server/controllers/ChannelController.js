import mongoose from "mongoose";
import Channel from "../models/ChannelModel.js";
import User from "../models/UserModels.js";

export const createChannel = async (request, response, next) => {
  try {
    const { name, members } = request.body;
    const userId = request.userId;

    const admin = await User.findById(userId);
    if (!admin) {
      return response.status(400).json({ error: "Admin user not found." });
    }

    // Validate members
    const validMembers = await User.find({ _id: { $in: members } });
    if (validMembers.length !== members.length) {
      return response.status(400).send("Some members are not valid users.");
    }

    // Create new channel
    const newChannel = new Channel({
      name,
      members,
      admin: userId,
    });
    await newChannel.save();

    return response.status(201).json({ channel: newChannel });
  } catch (error) {
    console.error("Error creating channel:", error);
    return response.status(500).json({ error: "Internal server error." });
  }
};

export const getUserChannels = async (request, response, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(request.userId);

    // Fetch channels where user is either admin or member
    const channels = await Channel.find({
      $or: [{ admin: userId }, { members: userId }],
    }).sort({ updatedAt: -1 });

    return response.status(201).json({ channels });
  } catch (error) {
    console.error("Error fetching user channels:", error);
    return response.status(500).json({ error: "Internal server error." });
  }
};
