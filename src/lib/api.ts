import axios from "axios";

export const api = axios.create({
  // baseURL: "http://localhost:3000/api",
  baseURL: "https://balance-app-opal.vercel.app/api",
})