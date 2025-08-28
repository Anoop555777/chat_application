import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePassword as updatePasswordApi } from "../../services/apiUsers";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const useUpdatePassword = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: updatePassword, isPending: isUpdating } = useMutation({
    mutationFn: updatePasswordApi,
    onSuccess: () => {
      toast.success("Password updated successfully");
      toast.success("Please log in again with your new password");
      queryClient.setQueryData(["user"], null);
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something want wrong");
    },
  });

  return { updatePassword, isUpdating };
};

export default useUpdatePassword;
