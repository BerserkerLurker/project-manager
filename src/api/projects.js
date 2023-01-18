import { projectsUri, url } from ".";
import jwtInterceptor from "./helpers/jwtInterceptor";

export async function getAllProjects() {
  try {
    const res = await jwtInterceptor.get(url + projectsUri, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${globalThis.accessToken}` },
    });
    // console.log(res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
}


export async function getProject(id) {
  try {
    const res = await jwtInterceptor.get(url + projectsUri + `/${id}`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${globalThis.accessToken}` },
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function createProject(params) {
  try {
    const res = await jwtInterceptor.post(url + projectsUri, params, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${globalThis.accessToken}` },
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteProject(id) {
  try {
    const res = await jwtInterceptor.delete(url + projectsUri + `/${id}`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${globalThis.accessToken}` },
    });
    console.log(res);
  } catch (error) {
    throw error;
  }
}

export async function updateProject(params) {
  try {
    const res = await jwtInterceptor.patch(
      url + projectsUri + `/${params.id}`,
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
