import client from "../../api/client.ts";
import { type RegisterInput } from "../../../../shared/schemas/auth.schema.ts";

export const register = (data: RegisterInput) => client.post("/auth/register", data);

export const verify = (data: { otp: string }) => client.post("/auth/email-verify", data);