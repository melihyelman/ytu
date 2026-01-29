import { z } from "zod";

export const signInSchema = z.object({
    username: z.string().min(3, "Kullanıcı adı en az 3 karakter olmalı"),
    password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
});
export type SignInInput = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
    username: z.string().min(3, "Kullanıcı adı en az 3 karakter olmalı"),
    email: z.string().email("Geçerli bir e-posta adresi giriniz"),
    password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
  });
  
  export type SignUpInput = z.infer<typeof signUpSchema>;

  export type UserDTO = {
    id: number;
    username: string;
    email: string | null;
    roleId: number;
    createdAt: string;  
  };
  
  export type SignInDTO = {
    id: number;
    user: UserDTO;
    token: string;     
    expiresIn: number; 
  };
  
  export type SignUpDTO = {
    id: number;
    user: UserDTO;
  };