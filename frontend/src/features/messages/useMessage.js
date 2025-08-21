import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage } from "../../services/apiMessage";
import { useParams } from "react-router-dom";

const useMessage = () => {
  const queryClient = useQueryClient();
  const { channelId } = useParams();
  const { mutate: message, isPending } = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["channel", channelId],
      });
    },
  });

  return { message, isPending };
};

export default useMessage;
