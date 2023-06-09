import { tasksUri, url } from ".";
import jwtInterceptor from "./helpers/jwtInterceptor";

export async function getAllTasks() {
  try {
    const res = await jwtInterceptor.get(url + tasksUri, {
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

export async function getTask(id) {
  try {
    const res = await jwtInterceptor.get(url + tasksUri + `/${id}`, {
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

export async function getTaskAssignees(id) {
  try {
    const res = await jwtInterceptor.get(
      url + tasksUri + "/assignees" + `/${id}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${globalThis.targetProxy.accessToken}`,
        },
      }
    );
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

export async function deleteTask(id) {
  try {
    const res = await jwtInterceptor.delete(url + tasksUri + `/${id}`, {
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

export async function updateTask(params) {
  try {
    const res = await jwtInterceptor.patch(
      url + tasksUri + `/${params.id}`,
      params,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${globalThis.targetProxy.accessToken}`,
        },
      }
    );
    // console.log(res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function assignUserToTask(params) {
  try {
    const res = await jwtInterceptor.post(
      url + tasksUri + `/assignees/${params.taskId}`,
      params,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${globalThis.targetProxy.accessToken}`,
        },
      }
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function unassignUserFromTask(params) {
  try {
    const res = await jwtInterceptor.delete(
      url + tasksUri + `/assignees/${params.taskId}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${globalThis.targetProxy.accessToken}`,
        },
        data: {
          ...params,
        },
      }
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
}
