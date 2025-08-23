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

    socket.emit("joinChannel", channelId);

    const handleNewMessage = (newMsg) => {
      queryClient.setQueryData(["channel", channelId], (old) => {
        if (!old) return old;

        // Replace temp message (if exists) with the real one
        const exists = old.messages.some((m) => m._id === newMsg._id);
        if (exists) return old;

        return {
          ...old,
          messages: old.messages
            .map((m) =>
              m.pending && m.content === newMsg.content ? newMsg : m
            )
            .concat(
              old.messages.some(
                (m) => m.pending && m.content === newMsg.content
              )
                ? []
                : [newMsg]
            ),
        };
      });
    };

    const handleDeleteMessage = (msgId) => {
      console.log("handleDeleteMessage", msgId);
      queryClient.setQueryData(["channel", channelId], (old) => {
        if (!old) return old;

        return {
          ...old,
          messages: old.messages.filter((m) => m._id !== msgId),
        };
      });
    };

    socket.on("newMessage", handleNewMessage);

    socket.on("deleteMessage", handleDeleteMessage);

    return () => {
      socket.emit("leaveChannel", channelId);
      socket.off("newMessage", handleNewMessage);
      socket.off("deleteMessage", handleDeleteMessage);
    };
  }, [channelId, queryClient, socket]);

  return { channel, isLoading };
};

export default useChannel;
