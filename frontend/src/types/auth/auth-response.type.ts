export type ServerRegisterResponseType = {
  success: boolean;
  data: {
    user?: {
      id: string;
      name: string;
      email: string;
    };
  };
  message: string;
};
export type ServerVerifyResponseType = {
  success: boolean;
  data: {
    accessToken: string;
  };
  message: string;
};

export type ServerLoginResponseType = {
  success: boolean;
  data: {
    user?: {
      id: string;
      name: string;
      email: string;
    };
    accessToken?: string;
  };
  message: string;
};

export type ServerCurrentUserResponseType = {
  success: boolean;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
  message: string;
};

export type UserType = ServerCurrentUserResponseType["data"]["user"];
