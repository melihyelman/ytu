import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpInput } from "../types/auth";
import { useSignUp, useSignIn } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function RegisterForm() {
  const { register, handleSubmit, formState } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { username: "", email: "", password: "" },
  });
  const { errors } = formState;

  const signUp = useSignUp();
  const signIn = useSignIn();
  const navigate = useNavigate();
  const [flowError, setFlowError] = useState<string | null>(null);

  const isPending = signUp.isPending || signIn.isPending;

  const onSubmit = async (data: SignUpInput) => {
    setFlowError(null);
    try {
      await signUp.mutateAsync(data);
      await signIn.mutateAsync({ 
        username: data.username, 
        password: data.password 
      });
      navigate("/clubs", { replace: true });
    } catch (err: any) {
      const apiMsg =
        err?.response?.data?.message ??
        err?.message ??
        "Beklenmeyen bir hata oluştu";
      setFlowError(apiMsg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Kayıt Ol</h2>

      <div className="mb-3">
        <input
          type="text"
          placeholder="Kullanıcı adı"
          autoComplete="username"
          {...register("username")}
          className="w-full p-2 border rounded"
          aria-invalid={!!errors.username || undefined}
        />
        {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
      </div>

      <div className="mb-3">
        <input
          type="email"
          placeholder="E-posta"
          autoComplete="email"
          {...register("email")}
          className="w-full p-2 border rounded"
          aria-invalid={!!errors.email || undefined}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div className="mb-3">
        <input
          type="password"
          placeholder="Şifre"
          autoComplete="new-password"
          {...register("password")}
          className="w-full p-2 border rounded"
          aria-invalid={!!errors.password || undefined}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      <button type="submit" disabled={isPending} className="w-full bg-emerald-600 text-white p-2 rounded disabled:opacity-50">
        {isPending ? "Kaydediliyor..." : "Kayıt Ol"}
      </button>

      {(flowError ||
        (signUp.isError && (signUp.error as any)?.message) ||
        (signIn.isError && (signIn.error as any)?.message)) && (
        <p className="text-red-500 text-sm mt-2">
          {flowError ||
            (signUp.isError && ((signUp.error as any)?.response?.data?.message || (signUp.error as Error).message)) ||
            (signIn.isError && ((signIn.error as any)?.response?.data?.message || (signIn.error as Error).message))}
        </p>
      )}

      <p className="text-sm text-center mt-4">
        Zaten hesabın var mı?{" "}
        <Link to="/login" className="text-purple-700 underline">
          Giriş yap
        </Link>
      </p>
    </form>
  );
}
