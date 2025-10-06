import { type FC, type ReactNode } from "react";
import { Navigate } from "react-router-dom";

/** Melindungi rute admin. Jika belum login → redirect ke /admin/login */
const ProtectedRoute: FC<{ isAdminLoggedIn: boolean; children: ReactNode }> = ({
  isAdminLoggedIn,
  children,
}) => {
  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;