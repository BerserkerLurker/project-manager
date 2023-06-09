import axios from "axios";
import {
  checkEmailUri,
  forgotPasswordUri,
  loginUri,
  logoutUri,
  resetPasswordUri,
  sendVerifyEmailUri,
  signUpUri,
  updateUserUri,
  url,
  verifyUri,
} from ".";
import jwtInterceptor from "./helpers/jwtInterceptor";

export async function login(params) {
  try {
    const res = await axios.post(url + loginUri, params, {
      withCredentials: true,
    });
    globalThis.targetProxy.accessToken = res.data.accessToken;
    return res.data.user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function signUp(params) {
  try {
    const res = await axios.post(url + signUpUri, params, {
      withCredentials: true,
    });
    globalThis.targetProxy.accessToken = res.data.accessToken;
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function verify(params) {
  // const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  try {
    // await delay(2000);
    const res = await axios.get(
      url + verifyUri + `/${params.userId}/${params.token}`,
      {
        withCredentials: true,
      }
    );
    // console.log(res.data);
    // throw new Error("lol");
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function sendVerifyEmail(params) {
  try {
    const res = await axios.post(url + sendVerifyEmailUri, { ...params });
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function forgotpassword(params) {
  try {
    const res = await axios.post(url + forgotPasswordUri, { ...params });
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function resetPassword(params) {
  try {
    const res = await axios.get(url + resetPasswordUri + `/${params.userId}`);
    return res.data;
  } catch (error) {
    throw error;
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
    globalThis.targetProxy.accessToken = "";
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUser(params) {
  try {
    console.log(params);
    const res = await jwtInterceptor.patch(url + updateUserUri, params, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${globalThis.targetProxy.accessToken}`,
      },
    });
    globalThis.targetProxy.accessToken = res.data.accessToken;
    return res.data.user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function checkEmail(email) {
  try {
    const res = await jwtInterceptor.post(url + checkEmailUri, email, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${globalThis.targetProxy.accessToken}`,
      },
    });
    // console.log(res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
}
