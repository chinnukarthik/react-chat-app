import { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { userAppStore } from "@/store";
import { Host } from "@/utils/constant";
import { colors } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { IoPowerSharp } from "react-icons/io5";
import { apiClient } from "@/lib/api-client";
import { LOGOUT_ROUTE } from "@/utils/constant";

function ProfileInfo() {
  const { userInfo, setUserInfo } = userAppStore();
  const [image, setImage] = useState(
    userInfo?.image ? `${Host}/${userInfo.image}` : null
  );
  const navigate = useNavigate();

  useEffect(() => {
    console.log("ProfileInfo userInfo.image updated:", userInfo.image);
    setImage(userInfo?.image ? `${Host}/${userInfo.image}` : null);
  }, [userInfo.image]);

  const logout = async () => {
    try {
      const response = await apiClient.post(
        LOGOUT_ROUTE,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        navigate("/auth");
        setUserInfo(null);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]">
      <div className="flex gap-3 items-center justify-center">
        <Avatar className="h-12 w-12 rounded-full overflow-hidden">
          {image ? (
            <AvatarImage
              src={image}
              alt="profile"
              className="object-cover w-full h-full bg-black"
            />
          ) : (
            <div
              className={`uppercase h-12 w-12  text-lg border-[1px] flex items-center justify-center rounded-full ${
                colors[userInfo.color]
              }`}
            >
              {userInfo.firstName
                ? userInfo.firstName.charAt(0)
                : userInfo.email.charAt(0)}
            </div>
          )}
        </Avatar>
        <div>
          {userInfo.firstName && userInfo.lastName
            ? `${userInfo.firstName} ${userInfo.lastName}`
            : "User"}
        </div>
      </div>
      <div className="flex gap-5 ">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FiEdit2
                onClick={() => navigate("/profile")}
                className="text-green-500 text-xl font-medium"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <IoPowerSharp
                onClick={logout}
                className="text-red-400 text-xl font-medium"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

export default ProfileInfo;
