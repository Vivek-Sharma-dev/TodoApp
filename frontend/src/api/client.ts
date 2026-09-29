import axios from "axios";
import config from "../config/config";
import { getAccessToken } from "../auth/tokenStore";

const client = axios.create({
    baseURL: config.serverUrl,
    withCredentials: true
});

client.interceptors.request.use((config) => {
    const accessToken = getAccessToken();

    if(accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config
})

export default client;