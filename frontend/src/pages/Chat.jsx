import { useNavigate } from "react-router-dom";
import useChannelMy from "../features/channels/useChannelMy";
import SpinnerUI from "../ui/SpinnerUI";

const Chat = () => {
  const navigate = useNavigate();
  const { channels, isLoading } = useChannelMy();

  if (isLoading) return <SpinnerUI isLoading={isLoading} />;

  if (channels.length === 0) return <Text>No channels found</Text>;

  navigate(`/channel/${channels[0]._id}`);

  return null;
};

export default Chat;
