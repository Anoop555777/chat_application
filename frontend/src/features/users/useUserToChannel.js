import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getUsersOfChannel } from "../../services/apiUsers";

const useUserToChannel = () => {
  const { channelId } = useParams();
  const { data: channelMember, isLoading } = useQuery({
    queryFn: () => getUsersOfChannel(channelId),
    queryKey: ["members", channelId],
  });
  return { channelMember, isLoading };
};

export default useUserToChannel;
