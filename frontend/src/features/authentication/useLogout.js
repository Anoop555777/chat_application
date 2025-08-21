import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signout } from "../../services/apiAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const { mutate: logout, isPending } = useMutation({
    mutationFn: signout,
    onSuccess: () => {
      toast.success("user logout successfull");
      navigate("/login", { replace: true });
      queryClient.removeQueries();
    },
    onError: () => {
      toast.error("something went wrong");
    },
  });

  return { logout, isPending };
};

export default useLogout;
