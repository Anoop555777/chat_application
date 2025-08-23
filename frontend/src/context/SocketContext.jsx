import { createContext, useContext, useEffect } from "react";
import socket from "../socket";
const SocketContext = createContext();

function SocketProvider({ children }) {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to socket:", socket.id);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
    // ⚠️ Don't disconnect in cleanup, or StrictMode will kill connection
    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

function useSocket() {
  const socket = useContext(SocketContext);

  if (!socket) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return socket;
}

// eslint-disable-next-line react-refresh/only-export-components
export { SocketProvider, useSocket };
