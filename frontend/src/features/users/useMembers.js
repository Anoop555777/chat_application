import { useQuery } from "@tanstack/react-query";
import { getAllMembers } from "../../services/apiUsers";

const useMembers = () => {
  const { data: members, isLoading } = useQuery({
    queryKey: ["allmembers"],
    queryFn: getAllMembers,
  });
  return { members, isLoading };
};

export default useMembers;
