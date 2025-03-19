import { useEffect, useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiClient } from "@/lib/api-client";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { userAppStore } from "@/store";
import {
  GET_ALL_CONTACTS_ROUTES,
  CREATE_CHANNEL_ROUTE,
} from "@/utils/constant";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multipleselect";

function CreateChannel() {
  const { addChannel } = userAppStore();
  const [newChannelModal, setNewChannelModal] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [channelName, setChannelName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const getData = async () => {
      const response = await apiClient.post(
        GET_ALL_CONTACTS_ROUTES,
        {},
        { withCredentials: true }
      );
      setAllContacts(response.data.contacts);
    };
    getData();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const CreateChannel = async () => {
    try {
      if (channelName.length > 0 && selectedContacts.length > 0) {
        const response = await apiClient.post(
          CREATE_CHANNEL_ROUTE,
          {
            name: channelName,
            members: selectedContacts.map((contact) => contact.value),
          },
          { withCredentials: true }
        );

        if (response.status === 201) {
          setChannelName("");
          setSelectedContacts([]);
          setNewChannelModal(false);
          addChannel(response.data.channel);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              onClick={() => setNewChannelModal(true)}
              className="text-neutral-400 font-light text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
            />
          </TooltipTrigger>
          <TooltipContent>Create New Channel</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
        <DialogContent
          ref={containerRef}
          className="bg-[#181920] border-0 text-white w-[400px] h-auto flex flex-col"
        >
          <DialogHeader>
            <DialogTitle>Fill details for new channel</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Channel name"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => setChannelName(e.target.value)}
              value={channelName}
            />
          </div>
          <div ref={dropdownRef}>
            <MultipleSelector
              defaultOptions={allContacts}
              className="rounded-lg p-4 bg-[#2c2e3b] border-none text-white py-2"
              onChange={setSelectedContacts}
              onFocus={() => setIsDropdownOpen(true)}
              value={selectedContacts}
              placeholder="Search Contacts"
              emptyIndicator={
                <p className="leading-10 text-center text-lg text-gray-500">
                  No results found.
                </p>
              }
            />
          </div>
          {/** Ensure Submit Button is Always Visible */}
          {!isDropdownOpen && (
            <div>
              <Button
                onClick={CreateChannel}
                className="w-full transition-all duration-300 bg-green-400 hover:bg-green-700"
              >
                Create Channel
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateChannel;
