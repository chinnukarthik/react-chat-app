import { createContext, useContext, useEffect, useRef } from "react";
import { userAppStore } from "@/store";
import { io } from "socket.io-client";
import { Host } from "@/utils/constant";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const { userInfo } = userAppStore();

  useEffect(() => {
    if (userInfo) {
      socket.current = io(Host, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });

      socket.current.on("connect", () => {
        console.log("Connected to socket server");
      });
      const handleReceiveMessage = (message) => {
        const { selectedChatData, selectedChatType, addMessage } =
          userAppStore.getState();
        if (
          selectedChatType !== undefined &&
          (selectedChatData._id === message.sender._id ||
            selectedChatData._id === message.recipient._id)
        ) {
          console.log("Message received", message);
          addMessage(message);
        }
      };
      const handleReceiveChannelMessage = (message) => {
        console.log("Received Channel Message:", message);

        const {
          selectedChatData,
          selectedChatType,
          selectedChatMessages,
          setSelectedChatMessages,
        } = userAppStore.getState();

        if (
          selectedChatType === "channel" &&
          selectedChatData._id === message.channelId
        ) {
          // Update messages in state to include the new message
          setSelectedChatMessages([...selectedChatMessages, message]);
        }
      };

      socket.current.on("receiveMessage", handleReceiveMessage);
      socket.current.on("receive-channel-message", handleReceiveChannelMessage);
      return () => {
        if (socket.current) {
          socket.current.disconnect();
        }
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current || null}>
      {children}
    </SocketContext.Provider>
  );
};
