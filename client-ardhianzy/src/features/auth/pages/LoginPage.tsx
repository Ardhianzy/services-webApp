// import { useState } from "react";
// import { useAuth } from "@/features/auth/store";
// import { useLocation, useNavigate } from "react-router-dom";

// export default function LoginPage() {
//   const { login, error, loading } = useAuth();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [localError, setLocalError] = useState<string | null>(null);
//   const navigate = useNavigate();
//   const location = useLocation() as unknown as { state?: { from?: { pathname?: string } } };
//   const from = location.state?.from?.pathname || "/admin";

//   async function onSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setLocalError(null);
//     if (!username || !password) {
//       setLocalError("Username dan password wajib diisi");
//       return;
//     }
//     try {
//       await login({ username, password });
//       navigate(from, { replace: true });
//     } catch {}
//   }

//   return (
//     <div className="min-h-[60vh] flex items-center justify-center p-6">
//       <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
//         <h1 className="text-2xl font-bold">Masuk</h1>

//         {(localError || error) && (
//           <div className="rounded border border-red-500/50 bg-red-500/10 px-3 py-2 text-sm text-red-200">
//             {localError || error}
//           </div>
//         )}

//         <label className="block">
//           <span className="text-sm">Username</span>
//           <input
//             className="mt-1 w-full rounded border bg-transparent px-3 py-2"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             autoComplete="username"
//           />
//         </label>

//         <label className="block">
//           <span className="text-sm">Password</span>
//           <input
//             type="password"
//             className="mt-1 w-full rounded border bg-transparent px-3 py-2"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             autoComplete="current-password"
//           />
//         </label>

//         <button
//           disabled={loading}
//           className="w-full rounded-full border px-4 py-2 font-medium hover:bg-white/10 disabled:opacity-60"
//         >
//           {loading ? "Memproses…" : "Masuk"}
//         </button>

//         {/* <p className="text-center text-sm opacity-70">
//           Belum punya akun? <Link to="/signup" className="underline">Daftar</Link>
//         </p> */}
//       </form>
//     </div>
//   );
// }