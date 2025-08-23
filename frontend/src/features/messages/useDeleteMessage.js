import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMessage as deleteMessageApi } from "../../services/apiMessage";
import { useParams } from "react-router-dom";

const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  const { channelId } = useParams();

  const { mutate: deleteMessage, isPending: isDeleting } = useMutation({
    mutationFn: deleteMessageApi,

    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ["channel", channelId] });

      const prevData = queryClient.getQueryData(["channel", channelId]);

      queryClient.setQueryData(["channel", channelId], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          messages: oldData.messages.filter((m) => m._id !== id),
        };
      });

      return { prevData };
    },

    onError: (err, variables, ctx) => {
      if (ctx?.prevData) {
        queryClient.setQueryData(["channel", channelId], ctx.prevData);
      }
    },

    // don’t refetch, optimistic update + socket will keep in sync
    retry: false,
  });

  return { isDeleting, deleteMessage };
};

export default useDeleteMessage;
