import axios from "axios";
import { loginUri, logoutUri, signUpUri, url } from ".";

export async function login(params) {
  try {
    const res = await axios.post(url + loginUri, params, {
      withCredentials: true,
    });
    globalThis.accessToken = res.data.accessToken;
    return res.data.user;
  } catch (error) {
    console.log(error);
  }
}

export async function signUp(params) {
  try {
    const res = await axios.post(url + signUpUri, params, {
      withCredentials: true,
    });
    globalThis.accessToken = res.data.accessToken;
    return res.data.user;
  } catch (error) {
    console.log(error);
  }
}

export async function logout() {
  try {
    const res = await axios.post(
      url + logoutUri,
      {},
      {
        withCredentials: true,
      }
    );
    globalThis.accessToken = "";
  } catch (error) {
    console.log(error);
  }
}
