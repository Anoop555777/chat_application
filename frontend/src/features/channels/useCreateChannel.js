import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createChannel as createChannelApi } from "../../services/apiChannels";
import toast from "react-hot-toast";

const useCreateChannel = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: createChannel, isPending } = useMutation({
    mutationFn: createChannelApi,
    onSuccess: (data) => {
      console.log(data);
      toast.success("channel created");
      queryClient.invalidateQueries({
        queryKey: ["channels"],
      });
      navigate(`/channel/${data._id}`, { replace: true });
    },
    onError: (error) => {
      console.log(error);
      toast.error(error?.response?.data.message || "something went wrong");
    },
  });

  return {
    createChannel,
    isPending,
  };
};

export default useCreateChannel;
