export interface SigupValidateUsernameRequest {
    username: string;
}

export interface SigupValidateUsernameResponse {
    error: string;
    isAvailable: boolean;
}
