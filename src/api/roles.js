import { rolesUri, url } from ".";
import jwtInterceptor from "./helpers/jwtInterceptor";

export async function getAllRoles() {
  try {
    const res = await jwtInterceptor.get(url + rolesUri, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${globalThis.accessToken}` },
    });
    // console.log(res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
}