import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile as updateProfileApi } from "../../services/apiUsers";
import toast from "react-hot-toast";

const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: updateProfileApi,
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Something want wrong");
    },
  });
  return { updateProfile, isPending };
};

export default useUpdateProfile;
