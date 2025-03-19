import React, { useEffect, useRef } from "react";
import moment from "moment";
import { userAppStore } from "@/store";
import { apiClient } from "@/lib/api-client";
import { GET_ALL_MESSAGE_ROUTE } from "@/utils/constant";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Host } from "@/utils/constant";

function MessageContainer() {
  const {
    selectedChatType,
    setSelectedChatMessages,
    selectedChatData,
    selectedChatMessages,
    userInfo,
  } = userAppStore();
  const scrollRef = useRef();

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_ALL_MESSAGE_ROUTE,
          { id: selectedChatData._id, chatType: selectedChatType },
          { withCredentials: true }
        );

        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (selectedChatData._id) {
      getMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const renderMessages = () => {
    return selectedChatMessages.map((message, index) => (
      <div
        key={index}
        className={
          message.sender?._id === userInfo?._id ? "text-right" : "text-left"
        }
      >
        <div className="flex items-center gap-3">
          {message.sender && message.sender.image ? (
            <Avatar>
              <AvatarImage
                src={`${Host}/${message.sender.image}`}
                alt="profile"
              />
              <AvatarFallback>
                {message.sender.firstName?.charAt(0) || "?"}
              </AvatarFallback>
            </Avatar>
          ) : (
            <span>{message.sender?.firstName || "Unknown User"}</span>
          )}
          <div
            className={`p-3 rounded-lg max-w-[60%] break-words ${
              message.sender?._id === userInfo?._id
                ? "bg-green-800 text-white"
                : "bg-gray-700 text-white"
            }`}
          >
            {message.content}
          </div>
        </div>
        <span className="text-xs text-gray-500">
          {moment(message.timestamp).format("LT")}
        </span>
      </div>
    ));
  };

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {renderMessages()}
      <div ref={scrollRef} />
    </div>
  );
}

export default MessageContainer;
