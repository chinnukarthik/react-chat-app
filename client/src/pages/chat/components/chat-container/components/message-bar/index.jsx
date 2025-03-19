import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import { userAppStore } from "@/store";
import { useSocket } from "@/context/SocketContext";

function MessageBar() {
  const emojiRef = useRef();
  const socket = useSocket();
  const { selectedChatType, selectedChatData, userInfo } = userAppStore();
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [message, setMessage] = useState("");

  // To close emoji picker when clicking outside the emoji picker bar
  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //Handle message send and receive
  const handleSendMessage = async () => {
    if (message.trim() === "") return;

    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      });
    } else if (selectedChatType === "channel") {
      socket.emit("send-channel-message", {
        sender: userInfo.id,
        content: message,
        messageType: "text",
        fileUrl: undefined,
        channelId: selectedChatData._id,
      });
    }

    setMessage("");
  };

  // Handling emojis
  const handleEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex gap-4 md:gap-6 mb-2 justify-center items-center px-4 md:px-8 w-full">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-3 md:gap-5 pr-3 md:pr-5">
        {/* input  */}
        <input
          type="text"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 w-full min-w-0 p-2 md:p-4 lg:p-5 bg-transparent rounded-md focus:outline-none"
        />
        {/* Attachment Button  */}
        <button className="text-neutral-500 focus:outline-none focus:text-white transition-all">
          <GrAttachment className="text-xl md:text-2xl" />
        </button>
        {/* Emoji Button and Emoji Picker  */}
        <div className="relative">
          <button
            onClick={() => setEmojiOpen((prev) => !prev)}
            className="text-neutral-500 focus:outline-none focus:text-white transition-all"
          >
            <RiEmojiStickerLine className="text-2xl md:text-3xl" />
          </button>
          {emojiOpen && (
            <div
              ref={emojiRef}
              className="absolute bottom-16 right-0 z-50 w-69 md:w-72 lg:w-80"
            >
              <EmojiPicker
                theme="dark"
                onEmojiClick={handleEmoji}
                autoFocusSearch={false}
              />
            </div>
          )}
        </div>
      </div>
      {/* Submit Button  */}
      <button
        onClick={handleSendMessage}
        className="bg-green-400 hover:bg-green-600 focus:bg-green-500 rounded-md p-2 md:p-4 transition-all"
      >
        <IoSend className="text-xl md:text-2xl" />
      </button>
    </div>
  );
}

export default MessageBar;
