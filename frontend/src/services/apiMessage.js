import axios from "axios";

export async function sendMessage({ channelId, text }) {
  const { data } = await axios.post(`/api/v1/channels/${channelId}/messages`, {
    content: text,
  });
  return data;
}

export async function deleteMessage({ id, channelId }) {
  await axios.delete(`/api/v1/channels/${channelId}/messages/${id}`);
  return null;
}
