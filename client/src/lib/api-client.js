import axios from "axios";
import { Host } from "@/utils/constant";

export const apiClient = axios.create({
  baseURL: Host.replace(/\/$/, ""),
});
