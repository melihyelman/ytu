import { useNavigate } from "react-router";
import LoginForm from "../../features/auth/components/LoginForm";
import { useEffect } from "react";
import { useAuthUser } from "../../features/auth/hooks/useAuth";

export default function LoginPage(){

    const navigate = useNavigate();
        const { data: user } = useAuthUser();
    
    useEffect(() => {
        if (user) {
          navigate("/clubs", { replace: true });
        }
      }, [user, navigate]);

          return (
            <div className="flex items-center justify-center min-h-screen">
              <LoginForm />
            </div>
          );
}