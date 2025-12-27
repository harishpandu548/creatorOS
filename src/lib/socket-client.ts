import { io } from "socket.io-client";
//this connects browser to server and runs once per tab
export const socket = io({
  path: "/api/socket",
});
