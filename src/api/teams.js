import { teamsUri, url } from ".";
import jwtInterceptor from "./helpers/jwtInterceptor";

export async function getAllTeams() {
  try {
    const res = await jwtInterceptor.get(url + teamsUri, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${globalThis.accessToken}` },
    });
    // console.log(res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function createTeam(params) {
  try {
    const res = await jwtInterceptor.post(url + teamsUri, params, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${globalThis.accessToken}` },
    });
    return res.data
  } catch (error) {
    throw error;
  }
}

export async function addTeamMember(params) {
  try {
    const res = await jwtInterceptor.post(
      url + teamsUri + `/members/${params.teamId}`,
      params,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${globalThis.accessToken}` },
      }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function updateTeamMember(params) {
  try {
    const res = await jwtInterceptor.patch(
      url + teamsUri + `/members/${params.teamId}`,
      params,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${globalThis.accessToken}` },
      }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function removeTeamMember(params) {
  try {
    const res = await jwtInterceptor.patch(
      url + teamsUri + `/members/${params.teamId}`,
      params,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${globalThis.accessToken}` },
      }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}
