import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage } from "../../services/apiMessage";
import { useParams } from "react-router-dom";
import useUser from "../authentication/useUser";

const useMessage = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { channelId } = useParams();

  const { mutate: message, isPending } = useMutation({
    mutationFn: sendMessage,

    // 1. Optimistic update
    onMutate: async (newMsg) => {
      await queryClient.cancelQueries({ queryKey: ["channel", channelId] });

      const prevData = queryClient.getQueryData(["channel", channelId]);

      const tempId = "temp-" + Date.now();

      queryClient.setQueryData(["channel", channelId], (old) => {
        if (!old) return;
        return {
          ...old,
          messages: [
            ...old.messages,
            {
              _id: tempId,
              content: newMsg.text,
              sender: { fullname: "You", _id: user._id },
              pending: true,
              createdAt: new Date().toISOString(),
            },
          ],
        };
      });

      return { prevData };
    },

    // 2. Rollback if failed
    onError: (err, newMsg, ctx) => {
      if (ctx?.prevData)
        queryClient.setQueryData(["channel", channelId], ctx.prevData);
    },

    // 3. No onSuccess update — socket will handle real message
  });

  return { message, isPending };
};

export default useMessage;
