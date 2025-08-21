import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login as loginApi } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: login, isPending: isLoging } = useMutation({
    mutationFn: loginApi,
    onSuccess: (response) => {
      // queryClient
      //   .getQueryCache()
      //   .findAll({ queryKey: ["User"] })
      //   .forEach(({ queryKey }) => {
      //     queryClient.setQueryData(queryKey, response.data.user);
      //   });
      toast.success(response.data.message);
      queryClient.setQueryData(["user"], response.data.user);
      navigate("/chat", { replace: true });
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  return { login, isLoging };
};

export default useLogin;
