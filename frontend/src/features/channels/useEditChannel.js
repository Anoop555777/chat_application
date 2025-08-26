import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editChannel as editChannelAsApi } from "../../services/apiChannels";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
const useEditChannel = () => {
  const { channelId } = useParams();
  const queryClient = useQueryClient();
  const { mutate: editChannel, isPending: isEditing } = useMutation({
    mutationFn: editChannelAsApi,
    onSuccess: () => {
      toast.success("Channel edited successfully");
      queryClient.invalidateQueries({
        queryKey: ["channels"],
      });
      queryClient.invalidateQueries({
        queryKey: ["channel", channelId],
      });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Something went wrong");
    },
  });
  return { isEditing, editChannel };
};

export default useEditChannel;
