import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup as signinApi } from "../../services/apiAuth";
import toast from "react-hot-toast";

const useSignup = () => {
  const queryClient = useQueryClient();

  const { isPending: isSignin, mutate: signup } = useMutation({
    mutationFn: signinApi,
    onSuccess: (response) => {
      toast.success(response.data.message);
      queryClient.setQueryData(["user"], response.data.user);
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  return { isSignin, signup };
};

export default useSignup;
