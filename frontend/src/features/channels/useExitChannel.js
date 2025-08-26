import { useMutation, useQueryClient } from "@tanstack/react-query";
import { exitSelfFromChannel } from "../../services/apiChannels";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const useExitChannel = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { isPending, mutate: exitChannel } = useMutation({
    mutationFn: exitSelfFromChannel,

    onSuccess: () => {
      toast.success("You have left the channel");
      queryClient.invalidateQueries({
        queryKey: ["channels"],
      });

      navigate("/chat");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  return { exitChannel, isPending };
};

export default useExitChannel;
