import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_API_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token") ?? ""}`,
    "Content-Type": "application/json",
    "User-Agent": process.env.REACT_APP_VERSION ?? "",
    "Sec-Fetch-Mode": "no-cors",
    "Access-Control-Allow-Origin": "*",
  },
});

/* const refreshAccessToken = async () => {
  const request = axios.create({
    baseURL: process.env.REACT_APP_BASE_API_URL,
    headers: {
      "Content-Type": "application/json",
      "User-Agent": process.env.REACT_APP_VERSION ?? "",
      "Sec-Fetch-Mode": "no-cors",
      "Access-Control-Allow-Origin": "*",
    },
  });

  return await request
    .post(
      "token",
      JSON.stringify({
        grant_type: "client_credentials",
        client_id: process.env.REACT_APP_CLIENT_ID,
        client_secret: process.env.REACT_APP_CLIENT_SECRET,
        enterprise_id: "4d4b5534-1461-424b-b547-38daace30eda",
        scope: "",
      })
    )
    .then((response) => {
      localStorage.setItem("access_token", response.data.data.access_token);

      return Promise.resolve(true);
    })
    .catch((error) => {
      return Promise.resolve(false);
    });
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const requestConfig = error.config;
    let refreshAccessTokenSuccess = true;

    if (error.response?.status === 401) {
      await refreshAccessToken().then((response) => {
        refreshAccessTokenSuccess = response;

        if (response) {
          requestConfig.headers["Authorization"] = `Bearer ${
            localStorage.getItem("access_token") ?? ""
          }`;
        }
      });
    }

    if (refreshAccessTokenSuccess) {
      return await axios(requestConfig);
    }

    return Promise.reject(error);
  }
); */

export default api;
