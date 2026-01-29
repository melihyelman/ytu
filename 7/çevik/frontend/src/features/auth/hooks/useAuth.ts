// hooks/useAuth.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMe, signIn, signOut, signUp } from "../api/authApi";
import { useNavigate } from "react-router";
import type { SignInInput, SignUpInput, UserDTO } from "../types/auth";

const QK = { me: ["me"] as const };

export function useAuthUser() {
  return useQuery<UserDTO>({
    queryKey: QK.me,
    queryFn: fetchMe,
    retry: false,
    staleTime: 60_000,
  });
}

export function useSignIn() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: SignInInput) => signIn(input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: QK.me });
      const back = sessionStorage.getItem("postLoginRedirect");
      sessionStorage.removeItem("postLoginRedirect");
      navigate(back || "/clubs", { replace: true });
    },
  });
}

export function useSignUp() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: SignUpInput) => signUp(input),
    onSuccess: async (_data, variables) => {
      await signIn(variables);
      await qc.invalidateQueries({ queryKey: QK.me });
      navigate("/clubs", { replace: true });
    },
  });
}

export function useSignOut() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => signOut(),
    onSuccess: () => {
      qc.removeQueries({ queryKey: QK.me });
    },
  });
}
