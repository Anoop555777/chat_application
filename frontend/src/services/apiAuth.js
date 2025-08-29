import axios from "axios";

export async function isLoggedIn() {
  const { data } = await axios.get("/api/v1/auth/isLoggedIn", {
    withCredentials: true,
  });
  return data?.user;
}

export async function signup(data) {
  console.log(data);
  const response = await axios({
    method: "POST",
    url: "/api/v1/auth/signup",
    data,
    withCredentials: true,
  });

  console.log(response);

  return response;
}

export async function login(data) {
  const response = await axios({
    method: "POST",
    url: "/api/v1/auth/login",
    data,
    withCredentials: true,
  });

  return response;
}

export async function verify(token) {
  const response = await axios({
    method: "GET",
    url: `/api/v1/auth/verification/${token}`,
    withCredentials: true,
  });

  return response;
}

export async function signout() {
  await axios.get("/api/v1/auth/signout");
  return null;
}

export async function resetPassword({ data, reset_token }) {
  const { password, confirmPassword } = data;

  const response = await axios.patch(
    `/api/v1/auth/resetpassword/${reset_token}`,
    {
      password,
      confirmPassword,
    }
  );

  return response.data;
}
