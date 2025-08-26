import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { deleteChannel as deleteChannelApi } from "../../services/apiChannels";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const useDeleteChannel = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: deleteChannel, isPending: isDeleting } = useMutation({
    mutationFn: deleteChannelApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["channels"],
      });
      navigate("/chat");
    },
    onError: (error) => {
      toast.error(
        error.response.data.message || "unable to delete the channel"
      );
    },
  });

  return { deleteChannel, isDeleting };
};

export default useDeleteChannel;
