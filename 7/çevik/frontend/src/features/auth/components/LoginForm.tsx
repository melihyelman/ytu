
import { useForm } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"
import {useSignIn} from "../hooks/useAuth";
import { signInSchema,SignInInput } from "../types/auth";
import { Link, useNavigate } from "react-router-dom";



export default function LoginForm(){
    const {register, handleSubmit,formState} = useForm<SignInInput>({
        resolver: zodResolver(signInSchema),
    });

    const {errors} = formState;
    const signIn = useSignIn();
    const navigate = useNavigate();

    const onSubmit = (data: SignInInput) => {
        signIn.mutate(data);
    }

 return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-sm mx-auto p-6 bg-white shadow rounded"
    >
      <h2 className="text-xl font-bold mb-4">Giriş Yap</h2>

      <div className="mb-3">
        <input
          type="text"
          placeholder="Kullanıcı adı"
          {...register("username")}
          className="w-full p-2 border rounded"
        />
        {errors.username && (
          <p className="text-red-500 text-sm">{errors.username.message}</p>
        )}
      </div>

      <div className="mb-3">
        <input
          type="password"
          placeholder="Şifre"
          {...register("password")}
          className="w-full p-2 border rounded"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={signIn.isPending}
        className="w-full bg-purple-600 text-white p-2 rounded disabled:opacity-50"
      >
        {signIn.isPending ? "Giriş yapılıyor..." : "Giriş Yap"}
      </button>

      {signIn.isError && (
        <p className="text-red-500 text-sm mt-2">
          {(signIn.error as Error).message}
        </p>
      )}
      <p className="text-sm text-center mt-4">
        Kayit Ol?{" "}
        <Link to="/register" className="text-purple-700 underline">
          Kayit Ol
        </Link>
      </p>
    </form>
  );


}