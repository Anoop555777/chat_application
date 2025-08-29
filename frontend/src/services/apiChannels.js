import axios from "axios";

export async function getMyChannels() {
  const { data } = await axios.get("/api/v1/channels/me/my-channels");
  return data?.channels;
}

export async function getChannel(channelId) {
  const { data } = await axios.get(`/api/v1/channels/${channelId}`);

  const result = {
    ...data?.channel,
    role: data?.role,
  };
  return result;
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

export async function exitSelfFromChannel(channelId) {
  await axios.delete(`/api/v1/channels/${channelId}/members/exit`);

  return null;
}

export async function deleteChannel(channelId) {
  await axios.delete(`/api/v1/channels/${channelId}`);

  return null;
}

export async function editChannel({ channelId, formData }) {
  const response = await axios.patch(
    `/api/v1/channels/${channelId}`,
    formData,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response?.data?.channel;
}
