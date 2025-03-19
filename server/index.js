import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose, { mongo } from "mongoose";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/AuthRoutes.js";
import contactRoutes from "./routes/ContactRoutes.js";
import setupSocket from "./socket.js";
import messageRoutes from "./routes/MessageRoute.js";
import channelRoutes from "./routes/ChannelRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;
const database_url = process.env.DATABASE_URL;
// cors handlng
app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use("/uploads/profiles", express.static("uploads/profiles"));

// cookieParser
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/channel", channelRoutes);
// port listen
const server = app.listen(port, () => {
  console.log(`Running,at http://localhost:${port}`);
});

setupSocket(server);

// mongoose checks
mongoose
  .connect(database_url)
  .then(() => console.log("DB connected successfull"))
  .catch((err) => console.log("DB connection error:", err));
