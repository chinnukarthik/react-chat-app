import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    default: null, // ✅ Optional for channel messages
  },
  channelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channels",
    default: null, // ✅ Optional for DM messages
  },
  messageType: {
    type: String,
    enum: ["text", "file"],
    required: true,
  },
  content: {
    type: String,
    required: function () {
      return this.messageType === "text";
    },
  },
  fileUrl: {
    type: String,
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Ensure that either `recipient` or `channelId` exists before saving
messageSchema.pre("validate", function (next) {
  if (!this.recipient && !this.channelId) {
    return next(new Error("Either recipient or channelId is required."));
  }
  next();
});

const Message = mongoose.model("Messages", messageSchema);
export default Message;
