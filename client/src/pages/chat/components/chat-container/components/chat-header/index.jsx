import { RiCloseFill } from "react-icons/ri";
import { userAppStore } from "@/store";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Host } from "@/utils/constant";
import { colors } from "@/lib/utils";

function ChatHeader() {
  const { closeChat, selectedChatData, selectedChatType } = userAppStore();
  return (
    <div className="h-[10vh] border-b-2 border-[#9698ad] flex items-center justify-between px-5 ">
      <div className="flex gap-5 items-center w-full justify-between">
        <div className="flex gap-3 items-center justify-center">
          <div className="flex items-center justify-center gap-3">
            {selectedChatType === "contact " ? (
              <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                {selectedChatData.image ? (
                  <AvatarImage
                    src={`${Host}/${selectedChatData.image}`}
                    alt="profile"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={`uppercase h-12 w-12  text-lg border-[1px] flex items-center justify-center rounded-full ${
                      colors[selectedChatData.color]
                    }`}
                  >
                    {selectedChatData.firstName
                      ? selectedChatData.firstName.charAt(0)
                      : selectedChatData.email.charAt(0)}
                  </div>
                )}
              </Avatar>
            ) : (
              <div className="bg-[#f1f1f111] h-10 w-10 flex items-center justify-center rounded-full">
                #
              </div>
            )}

            <div>
              {selectedChatType === "channel" && selectedChatData.name}
              {selectedChatType === "contact" && selectedChatData.firstName
                ? `${selectedChatData.firstName}  ${selectedChatData.lastName}`
                : selectedChatData.email}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <button
            onClick={closeChat}
            className="text-neutral-500 hover:text-white focus:border-none foucs:outline-none focus:text-white duration-300 transition-all"
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
