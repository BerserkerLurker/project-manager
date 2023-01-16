import axios from "axios";
import { refreshUri, url } from "..";

const jwtInterceptor = axios.create({});

jwtInterceptor.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status === 401) {
      try {
        const res = await axios.post(
          url + refreshUri,
          {},
          {
            withCredentials: true,
          }
        );
        globalThis.accessToken = res.data.accessToken;
        error.config.headers[
          "Authorization"
        ] = `Bearer ${globalThis.accessToken}`;
        console.log(error.config);
        return axios(error.config);
      } catch (err) {
        return Promise.reject(err);
      }
    } else {
      return Promise.reject(error);
    }
  }
);

export default jwtInterceptor;
