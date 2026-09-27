import client from "../../api/client.ts";
import { type RegisterInput } from "../../../../shared/schemas/auth.schema.ts";

export const register = (data: RegisterInput) => client.post("/auth/register", data);