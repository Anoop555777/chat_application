import { useQuery } from "@tanstack/react-query";
import { getMyChannels } from "../../services/apiChannels";

const useChannelMy = () => {
  const { data: channels, isLoading } = useQuery({
    queryFn: getMyChannels,
    queryKey: ["channels"],
  });

  return { channels, isLoading };
};

export default useChannelMy;
