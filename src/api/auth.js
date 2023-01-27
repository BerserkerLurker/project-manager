import axios from "axios";
import {
  checkEmailUri,
  loginUri,
  logoutUri,
  signUpUri,
  updateUserUri,
  url,
} from ".";
import jwtInterceptor from "./helpers/jwtInterceptor";

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

export async function updateUser(params) {
  try {
    console.log(params);
    const res = await jwtInterceptor.patch(url + updateUserUri, params, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${globalThis.accessToken}` },
    });
    globalThis.accessToken = res.data.accessToken;
    return res.data.user;
  } catch (error) {
    console.log(error);
  }
}

export async function checkEmail(email) {
  try {
    const res = await jwtInterceptor.post(url + checkEmailUri, email, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${globalThis.accessToken}` },
    });
    // console.log(res.data);
    return res.data;
  } catch (error) {
    throw(error);
  }
}
