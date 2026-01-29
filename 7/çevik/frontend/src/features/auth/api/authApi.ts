import {http} from "../../../lib/http"
import type { SignInDTO,SignUpDTO,SignInInput,SignUpInput,UserDTO } from "../types/auth"


export async function signUp(input: SignUpInput): Promise<SignUpDTO> {
    const res = await http.post<SignUpDTO>("/auth/sign-up",input);
    return res.data;
}

export async function signIn(input: SignInInput): Promise<SignInDTO> {
    const res = await http.post<SignInDTO>("/auth/sign-in",input)
    return res.data
}

export async function signOut(): Promise<void> {
    await http.post("/auth/sign-out");

}

export async function fetchMe(): Promise<UserDTO>{
    const res =  await http.get<UserDTO>("/users/me");
    return res.data;
}