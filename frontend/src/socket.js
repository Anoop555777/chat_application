import { io } from "socket.io-client";

//
const socket = io("http://localhost:8000", {
  withCredentials: true,
  autoConnect: true,
  transports: ["websocket"],
});

export default socket;
