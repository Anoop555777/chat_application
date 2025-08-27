import axios from "axios";

export async function getAllMembers() {
  const { data } = await axios.get("/api/v1/users/getAllChannelMembers");

  return data?.members;
}

export async function getUsersOfChannel(channelId) {
  const { data } = await axios.get(`/api/v1/channels/${channelId}/members`);

  return data?.members;
}

export async function addUserToChannel(channelId, members) {
  const { data } = await axios.post(
    `/api/v1/channels/${channelId}/members`,
    {
      members,
    },
    {
      withCredentials: true,
    }
  );

  return data?.members;
}

export async function removeUserFromChannel(channelId, userId) {
  await axios.delete(`/api/v1/channels/${channelId}/members/${userId}`, {
    withCredentials: true,
  });

  return null;
}
