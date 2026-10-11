import { rotateToken } from "../services/auth/refresh.api";
import { setAccessToken, clearAccessToken } from "./tokenStore.ts";
import { getMe } from "../services/auth/me.api";

export const authBootstrap = async () => {
  try {
    const response = await rotateToken();
    const accessToken = response.data.accessToken;

    if(!accessToken) {
      clearAccessToken();
      return null;
    }

    setAccessToken(accessToken);
    const userResponse = await getMe();

    return userResponse.data.user;
    // eslint-disable-next-line
  } catch (error) {
    clearAccessToken();
    return null;
  }
};
