// ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuthUser } from "../hooks/useAuth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useAuthUser();

  if (isLoading) return null; 

  if (!user) return <Navigate to="/" replace />;

  return <>{children}</>;
}
