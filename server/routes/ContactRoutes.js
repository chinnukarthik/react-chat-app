import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import {
  getAllContacts,
  getContactForDmList,
  searchContacts,
} from "../controllers/ContactController.js";

const contactRoutes = Router();

contactRoutes.post("/search", verifyToken, searchContacts);
contactRoutes.post("/get-contacts-for-dm", verifyToken, getContactForDmList);
contactRoutes.post("/get/all-contact", verifyToken, getAllContacts);
export default contactRoutes;
