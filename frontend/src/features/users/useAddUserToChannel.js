import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addUserToChannel as addUserToChannelApi } from "../../services/apiUsers";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const useAddUserToChannel = () => {
  const { channelId } = useParams();
  const queryClient = useQueryClient();
  const { mutate: addUserToChannel, isPending } = useMutation({
    mutationFn: (members) => addUserToChannelApi(channelId, members),
    onSuccess: () => {
      toast.success("Users added to channel");
      queryClient.invalidateQueries({
        queryKey: ["members", channelId],
      });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Something went wrong");
    },
  });

  return {
    addUserToChannel,
    isPending,
  };
};

export default useAddUserToChannel;
