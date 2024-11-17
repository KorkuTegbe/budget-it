export interface SignupLinkRequest {
    email: string;
    password: string;
    name: string;
}
  
export interface SignUpTokenRequest{
    fullName:string;
    password:string;
    email:any;
    deviceId:string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignUpResponse{
    token: string;
    user: object
}