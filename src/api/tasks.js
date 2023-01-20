import { tasksUri, url } from ".";
import jwtInterceptor from "./helpers/jwtInterceptor";

export async function getAllTasks() {
  try {
    const res = await jwtInterceptor.get(url + tasksUri, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${globalThis.accessToken}` },
    });
    // console.log(res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getTask(id) {
  try {
    const res = await jwtInterceptor.get(url + tasksUri + `/${id}`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${globalThis.accessToken}` },
    });
    // console.log(res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function createTask(params) {
  try {
    const res = await jwtInterceptor.post(url + tasksUri, params, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${globalThis.accessToken}` },
    });
    // console.log(res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteTask(id) {
  try {
    const res = await jwtInterceptor.delete(url + tasksUri + `/${id}`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${globalThis.accessToken}` },
    });
    // console.log(res);
  } catch (error) {
    throw error;
  }
}

export async function updateTask(params) {
  try {
    const res = await jwtInterceptor.patch(
      url + tasksUri + `/${params.id}`,
      params,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${globalThis.accessToken}` },
      }
    );
    // console.log(res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
}
