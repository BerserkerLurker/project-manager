import { chatUri, url } from ".";
import jwtInterceptor from "./helpers/jwtInterceptor";

// userIds[],type:""
export async function initiate(params) {
  try {
    const res = await jwtInterceptor.post(url + chatUri + "/initiate", params, {
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

export async function postMessage(params) {
  try {
    const res = await jwtInterceptor.post(
      url + chatUri + `/${params.roomId}/message`,
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
//?page=0&limit=10
export async function getRecentConversation(params) {
  try {
    const defaults = { page: 0, limit: 10 };
    const res = await jwtInterceptor.get(url + chatUri, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${globalThis.targetProxy.accessToken}`,
      },
      params: {
        ...defaults,
        ...params,
      },
    });
    // console.log(res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
}

//?page=0&limit=10
export async function getConversationByRoomId(params) {
  try {
    const res = await jwtInterceptor.get(url + chatUri + `/${params.roomId}`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${globalThis.targetProxy.accessToken}`,
      },
      params: {
        page: params.page,
        limit: params.limit,
      },
    });
    // console.log(res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function markConversationReadByRoomId(params) {
  try {
    const res = await jwtInterceptor.put(
      url + chatUri + `/${params.roomId}/mark-read`,
      {},
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

export async function getUnreadCount() {
  try {
    const res = await jwtInterceptor.get(url + chatUri + `/room/unreadcount`, {
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

export async function deleteRoomById(params) {
  try {
    const res = await jwtInterceptor.delete(
      url + chatUri + `/room/${params.roomId}`,
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

export async function deleteMessageById(params) {
  try {
    const res = await jwtInterceptor.delete(
      url + chatUri + `/message/${params.messageId}`,
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
