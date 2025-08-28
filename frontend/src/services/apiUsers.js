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

export async function updatePassword({
  currentPassword,
  password,
  confirmPassword,
}) {
  const { data } = await axios.patch(
    `/api/v1/auth/updatePassword`,
    {
      currentPassword,
      password,
      confirmPassword,
    },
    {
      withCredentials: true,
    }
  );
  return data?.user;
}

export async function updateProfile(formData) {
  const response = await axios.patch("/api/v1/users/updateMe", formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response?.data?.user;
}
