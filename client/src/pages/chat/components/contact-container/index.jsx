import React, { useEffect } from "react";
import ProfileInfo from "./components/profile";
import NewDm from "./new-dm";
import { apiClient } from "@/lib/api-client";
import { GET_DM_CONTACTS_ROUTES } from "@/utils/constant";
import { userAppStore } from "@/store";
import ContactList from "@/components/contact-list";
import CreateChannel from "./components/create-channel";
import { GET_USER_CHANNELS_ROUTE } from "@/utils/constant";

function ContactContainer() {
  const {
    directMessageContacts,
    setDirectMessageContacts,
    setChannels,
    channels,
  } = userAppStore();
  useEffect(() => {
    const getcontacts = async () => {
      const response = await apiClient.post(
        GET_DM_CONTACTS_ROUTES,
        {},
        { withCredentials: true }
      );
      if (response.data.contacts) {
        setDirectMessageContacts(response.data.contacts);
      }
    };
    const getChannels = async () => {
      const response = await apiClient.post(
        GET_USER_CHANNELS_ROUTE,
        {},
        { withCredentials: true }
      );
      if (response.data.channels) {
        setChannels(response.data.channels);
      }
    };
    getcontacts();
    getChannels();
  }, [setChannels, setDirectMessageContacts]);
  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-black w-full ">
      <div className="flex p-4 justify-start items-center gap-2 font-bold text-xl md:text-2xl  text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-teal-500 ">
        CHAT APP
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-5 ">
          <Title text="Direct Messages" />
          <NewDm />
        </div>
        <div className="max-h-[38vh] overflow-y-auto">
          <ContactList contacts={directMessageContacts} />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-5 ">
          <Title text="Channels" />
          <CreateChannel />
        </div>
        <div className="max-h-[38vh] overflow-y-auto">
          <ContactList contacts={channels} isChannel={true} />
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
}

export default ContactContainer;

const Title = ({ text }) => {
  return (
    <h6 className="text-sm text-opacity-90 uppercase tracking-widest text-neutral-400 pl-10 font-light ">
      {text}
    </h6>
  );
};
