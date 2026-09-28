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
      accessToken: string
    };
    message: string;
};
