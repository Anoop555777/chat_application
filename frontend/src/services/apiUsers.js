import axios from "axios";

export async function getAllMembers() {
  const { data } = await axios.get("/api/v1/users/getAllChannelMembers");

  return data?.members;
}

export async function getUsersOfChannel(channelId) {
  const { data } = await axios.get(`/api/v1/channels/${channelId}/members`);

  return data?.members;
}
