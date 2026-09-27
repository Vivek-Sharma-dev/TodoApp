export type backendResponseType = {
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
