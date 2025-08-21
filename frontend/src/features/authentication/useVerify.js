import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { verify as verifyAasApi } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";

const useVerify = () => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const {
    mutate: verify,
    isPending,
    isError,
    isSuccess,
  } = useMutation({
    mutationFn: verifyAasApi,
    onSuccess: (response) => {
      toast.success(response.data.message);
      queryClient.setQueryData(["user"], response.data.user);
      navigate("/chat", { replace: true });
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });
  return { verify, isPending, isError, isSuccess };
};

export default useVerify;
