import client from "../../api/client";

export const me = ( ) => client.get('/auth/me');