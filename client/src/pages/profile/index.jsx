import { userAppStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { colors } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import {
  ADD_PROFILE_IMAGE_ROUTE,
  Host,
  REMOVE_PROFILE_IMAGE_ROUTE,
  UPDATE_PROFILE_ROUTE,
} from "@/utils/constant";

function Profile() {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = userAppStore();
  const [firstName, setFirstName] = useState(userInfo?.firstName || "");
  const [lastName, setLastName] = useState(userInfo?.lastName || "");
  const [image, setImage] = useState(
    userInfo?.image ? `${Host}/${userInfo.image}` : null
  );
  const [hovered, setHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(userInfo?.color || 0);
  const inputRef = useRef(null);

  // Update state when userInfo changes
  useEffect(() => {
    if (userInfo.profileSetUp) {
      setFirstName(userInfo?.firstName || "");
      setLastName(userInfo?.lastName || "");
      setIsSelected(userInfo?.color || 0);
      setImage(userInfo?.image ? `${Host}/${userInfo.image}` : null);
    }
  }, [userInfo]);

  // Profile validation
  const validateProfile = () => {
    if (!firstName.trim()) {
      toast.error("First Name is required");
      return false;
    }
    if (!lastName.trim()) {
      toast.error("Last Name is required");
      return false;
    }
    return true;
  };

  // Save profile changes
  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          { firstName, lastName, color: isSelected },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data) {
          setUserInfo({ ...response.data });
          toast.success("Profile update completed.");
          navigate("/chat");
        }
      } catch (error) {
        console.error("Profile update error:", error);
      }
    }
  };

  // Handle back button
  const handleBackward = () => {
    if (userInfo.profileSetUp) {
      navigate("/chat");
    } else {
      toast.error("Please setup profile first.");
    }
  };

  // Handle profile image upload
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const Data = new FormData();
      Data.append("profile-image", file);

      try {
        const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, Data, {
          withCredentials: true,
        });

        if (response.status === 200 && response.data.image) {
          setUserInfo((prev) => ({ ...prev, image: response.data.image }));
          toast.success("Image updated successfully.");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  // Handle profile image removal
  const handleDeleteImage = async () => {
    try {
      const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUserInfo({ ...userInfo, image: null });
        toast.success("Image removed successfully");
        setImage(null);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  return (
    <div className="bg-black h-[100vh] flex flex-col items-center justify-center gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        {/* Back Button */}
        <div onClick={handleBackward} className="w-fit">
          <IoArrowBack className="text-white text-4xl lg:text-6xl cursor-pointer" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Profile Picture Section */}
          <div
            className="h-full w-full md:w-48 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-28 w-28 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-28 w-28 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${colors[isSelected]}`}
                >
                  {firstName ? firstName.charAt(0) : userInfo?.email?.charAt(0)}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/50"
                onClick={
                  image ? handleDeleteImage : () => inputRef.current.click()
                }
              >
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
            {/* Hidden file input */}
            <input
              type="file"
              ref={inputRef}
              onChange={handleImageChange}
              className="hidden"
              name="profile-image"
              accept=".svg, .png, .jpg, .jpeg"
            />
          </div>

          {/* Input Fields */}
          <div className="min-w-32 md:w-64 flex flex-col gap-5 text-white items-center justify-center">
            <Input
              type="email"
              placeholder="Email"
              disabled
              value={userInfo?.email || ""}
              className="rounded-lg bg-[#2c2e3b] border-none"
            />
            <Input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="rounded-lg bg-[#2c2e3b] border-none"
              placeholder="First Name"
            />
            <Input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="rounded-lg bg-[#2c2e3b] border-none"
              placeholder="Last Name"
            />
            {/* Color Selection */}
            <div className="w-full flex gap-5">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className={`${color} rounded-full h-8 w-8 cursor-pointer transition-all duration-300 ${
                    isSelected === index ? "ring-2 ring-white" : ""
                  }`}
                  onClick={() => setIsSelected(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="w-full">
          <Button
            className="w-full bg-green-400 hover:bg-green-600 transition-all duration-300 h-10 md:h-14 lg:h-16"
            onClick={saveChanges}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
