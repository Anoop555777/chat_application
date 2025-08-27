import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeUserFromChannel as removeUserFromChannelApi } from "../../services/apiUsers";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const useRemoveUserFromChannel = () => {
  const { channelId } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: removeUserFromChannel, isPending } = useMutation({
    mutationFn: (userId) => removeUserFromChannelApi(channelId, userId),

    onSuccess: async () => {
      toast.success("User removed from channel");
      await queryClient.invalidateQueries({
        queryKey: ["members", channelId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["channels"],
      });
      const updatedMembers = queryClient.getQueryData(["members", channelId]);
      console.log(updatedMembers);
      if (updatedMembers?.length === 0) {
        // no members left → go back to chat
        navigate("/chat");
      }
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Something went wrong"),
  });

  return { removeUserFromChannel, isPending };
};

export default useRemoveUserFromChannel;
