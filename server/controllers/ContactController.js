import mongoose from "mongoose";
import User from "../models/UserModels.js";
import Message from "../models/MessagesModel.js";

//  SEARCH CONTACTS
export const searchContacts = async (request, response, next) => {
  try {
    const { searchTerm } = request.body;

    if (!searchTerm) {
      return response.status(400).send("searchTerm is required.");
    }

    // Escape special characters in regex
    const PurifiedSearchTerm = searchTerm.replace(/[.*+^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(PurifiedSearchTerm, "i");

    const contacts = await User.find({
      _id: { $ne: request.userId },
      $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
    });

    return response.status(200).json({ contacts });
  } catch (error) {
    console.error("Error searching contacts:", error);
    return response.status(500).send("Internal Server Error");
  }
};

// GET CONTACT LIST FOR DMs
export const getContactForDmList = async (request, response, next) => {
  try {
    let { userId } = request;
    userId = new mongoose.Types.ObjectId(userId);

    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$recipient",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$timestamp" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      { $unwind: "$contactInfo" },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: "$contactInfo.email",
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          Image: "$contactInfo.image",
          color: "$contactInfo.color",
        },
      },
      { $sort: { lastMessageTime: -1 } },
    ]);

    return response.status(200).json({ contacts });
  } catch (error) {
    console.error("Error fetching DM contacts:", error);
    return response.status(500).send("Internal Server Error");
  }
};

export const getAllContacts = async (request, response, next) => {
  try {
    const users = await User.find(
      { _id: { $ne: request.userId } },
      "firstName lastName _id email"
    );
    const contacts = users.map((user) => ({
      label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
      value: user._id,
    }));
    return response.status(200).json({ contacts });
  } catch (error) {
    console.error("Error searching contacts:", error);
    return response.status(500).send("Internal Server Error");
  }
};
