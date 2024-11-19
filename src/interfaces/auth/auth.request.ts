export interface SignupLinkRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string,
    phoneNumber: string,
    pin: number
}
  
export interface SignUpTokenRequest{
    fullName:string;
    password:string;
    email:any;
    deviceId:string;
}

export interface LoginRequest {
    email?: string;
    accountNumber: string;
    password: string;
}

export interface SignUpResponse{
    token: string;
    user: object
}