import { useQuery } from "@tanstack/react-query";
import { isLoggedIn } from "../../services/apiAuth";

function useUser() {
  const { isLoading, data: user } = useQuery({
    queryFn: isLoggedIn,
    queryKey: ["user"],
  });

  return {
    isLoading,
    user,
    isAuthenticated: Boolean(user?.fullname && user?.isVerified),
  };
}

export default useUser;
