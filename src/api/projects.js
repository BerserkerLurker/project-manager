import axios from "axios";
import { projectsUri, url } from ".";
import jwtInterceptor from "./helpers/jwtInterceptor";

export async function getAllProjects() {
  try {
    const res = await jwtInterceptor.get(url + projectsUri, {
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

// export async function getAllProjectAssignees(id) {
//   try {
//     const res = await jwtInterceptor.get(url + projectsUri + `/members/${id}`, {
//       withCredentials: true,
//       headers: { Authorization: `Bearer ${globalThis.targetProxy.accessToken}` },
//     });
//     // console.log(res.data);
//     return res.data;
//   } catch (error) {
//     throw error;
//   }
// }

export async function getAllProjectsAssignees(ids) {
  const requests = ids.map((id) =>
    jwtInterceptor.get(url + projectsUri + `/members/${id}`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${globalThis.targetProxy.accessToken}`,
      },
    })
  );
  try {
    const responses = await axios.all(requests);
    // const members = [];
    let projectsMembersList = {};
    responses.forEach((resp) => {
      projectsMembersList = {
        ...projectsMembersList,
        [resp.config.url.split("/").at(-1)]: resp.data,
      };
    });
    // console.log(projectsMembersList);
    return projectsMembersList;
  } catch (error) {
    throw error;
  }
}

export async function getProject(id) {
  try {
    const res = await jwtInterceptor.get(url + projectsUri + `/${id}`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${globalThis.targetProxy.accessToken}`,
      },
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
      headers: {
        Authorization: `Bearer ${globalThis.targetProxy.accessToken}`,
      },
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
      headers: {
        Authorization: `Bearer ${globalThis.targetProxy.accessToken}`,
      },
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

export async function assignUserToProject(params) {
  try {
    const res = await jwtInterceptor.post(
      url + projectsUri + `/members/${params.projectId}`,
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

export async function unassignUserFromProject(params) {
  try {
    const res = await jwtInterceptor.delete(
      url + projectsUri + `/members/${params.projectId}`,
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
