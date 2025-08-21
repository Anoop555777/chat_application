import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getChannel } from "./../../services/apiChannels";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useSocket } from "../../context/SocketContext";

const useChannel = () => {
  const { channelId } = useParams();
  const socket = useSocket();
  const queryClient = useQueryClient();

  const { data: channel, isLoading } = useQuery({
    queryFn: () => getChannel(channelId),
    enabled: !!channelId,
    queryKey: ["channel", channelId],
  });

  useEffect(() => {
    if (!channelId) return;

    // 1. Join channel room
    socket.emit("joinChannel", channelId);

    // 2. Listen for new messages
    socket.on("newMessage", (newMsg) => {
      queryClient.setQueryData(["channel", channelId], (old) => {
        if (!old) return old;
        return {
          ...old,
          messages: [...old.messages, newMsg],
        };
      });
    });

    // 3. Cleanup when leaving channel
    return () => {
      socket.emit("leaveChannel", channelId);
      socket.off("newMessage");
    };
  }, [channelId, queryClient, socket]);

  return { channel, isLoading };
};

export default useChannel;
