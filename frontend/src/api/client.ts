import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

import config from "../config/config";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "../auth/tokenStore";

const client = axios.create({
  baseURL: config.serverUrl,
  withCredentials: true,
});

let isRefreshing = false;

let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

// Attach access token to every request
client.interceptors.request.use((request) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    request.headers.Authorization = `Bearer ${accessToken}`;
  }

  return request;
});

// Handle expired access token
client.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest =
      error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

    // Only handle 401 responses
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Never try to refresh the refresh request itself
    if (originalRequest.url?.includes("/auth/refresh")) {
      clearAccessToken();
      return Promise.reject(error);
    }

    // Don't retry the same request multiple times
    if (originalRequest._retry) {
      clearAccessToken();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // Another request is already refreshing the token
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({
          resolve,
          reject,
        });
      }).then((newAccessToken) => {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return client(originalRequest);
      });
    }

    isRefreshing = true;

    try {
      const response = await client.post("/auth/refresh");

      const newAccessToken = response.data.data.accessToken;

      setAccessToken(newAccessToken);

      processQueue(null, newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return client(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      clearAccessToken();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default client;