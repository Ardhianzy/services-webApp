// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import type { PropsWithChildren } from "react";
// import { useAuth } from "@/features/auth/store";

// export default function ProtectedRoute({ children }: PropsWithChildren) {
//   const { user, loading } = useAuth();
//   const location = useLocation();

//   if (loading) {
//     return (
//       <div className="min-h-[40vh] grid place-items-center">
//         <div className="animate-pulse text-sm text-white/70">Memuat…</div>
//       </div>
//     );
//   }

//   if (!user) {
//     return <Navigate to="/login" replace state={{ from: location }} />;
//   }

//   return children ? <>{children}</> : <Outlet />;
// }