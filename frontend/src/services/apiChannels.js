import axios from "axios";

export async function getMyChannels() {
  const { data } = await axios.get("/api/v1/channels/me/my-channels");
  return data?.channels;
}

export async function getChannel(channelId) {
  const { data } = await axios.get(`/api/v1/channels/${channelId}`);
  return data?.channel;
}

export async function createChannel({ name, description, members }) {
  const { data } = await axios.post(
    "/api/v1/channels",
    {
      name,
      description,
      members,
    },
    {
      withCredentials: true,
    }
  );

  return data?.data?.channel;
}
