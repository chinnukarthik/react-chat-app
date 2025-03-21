export const Host = import.meta.env.VITE_SERVER_URL;

// Auth Routes for login,sign up,user-info

export const AUTH_ROUTERS = "api/auth";
export const SIGNUP_ROUTE = `${AUTH_ROUTERS}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTERS}/login`;
export const GET_USER_INFO = `${AUTH_ROUTERS}/user-info`;
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTERS}/update-profile`;
export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTERS}/add-profile-image`;
export const REMOVE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTERS}/remove-profile-image`;
export const LOGOUT_ROUTE = `${AUTH_ROUTERS}/logout`;

export const CONTACT_ROUTES = "api/contacts";
export const SEARCH_CONTACTS_ROUTES = `${CONTACT_ROUTES}/search`;
export const GET_DM_CONTACTS_ROUTES = `${CONTACT_ROUTES}/get-contacts-for-dm`;
export const GET_ALL_CONTACTS_ROUTES = `${CONTACT_ROUTES}/get/all-contact`;

export const MESSAGE_ROUTES = "api/messages";
export const GET_ALL_MESSAGE_ROUTE = `${MESSAGE_ROUTES}/get-messages`;

export const CHANNEL_ROUTES = "api/channel";
export const CREATE_CHANNEL_ROUTE = `${CHANNEL_ROUTES}/create-channel`;
export const GET_USER_CHANNELS_ROUTE = `${CHANNEL_ROUTES}/get-user-channels`;
