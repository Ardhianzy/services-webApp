import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/store";
import { ROUTES } from "@/app/routes";

export default function AdminRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[40vh] grid place-items-center">
        <div className="animate-pulse text-sm text-white/70">Memuat…</div>
      </div>
    );
  }
  if (!user) return <Navigate to={ROUTES.ADMIN.LOGIN} replace state={{ from: location }} />;

  return <Outlet />;
}