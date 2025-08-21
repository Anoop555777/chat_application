import axios from "axios";

export async function getMyChannels() {
  const { data } = await axios.get("/api/v1/channels/me/my-channels");
  return data?.channels;
}

export async function getChannel(channelId) {
  const { data } = await axios.get(`/api/v1/channels/${channelId}`);
  return data?.channel;
}
