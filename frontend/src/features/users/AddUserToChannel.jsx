import useUserToChannel from "./useUserToChannel";

const AddUserToChannel = () => {
  const { channelMember, isLoading } = useUserToChannel();
  console.log(channelMember);
  if (isLoading) return null;
  return <div>AddUserToChannel</div>;
};

export default AddUserToChannel;
