import type { LoginInput } from "../../../../shared/schemas/auth.schema";
import client from "../../api/client";


export const login = (data: LoginInput) => client.post("/auth/login", data);