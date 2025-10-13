// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/features/auth/store";

// export default function ProfilePage() {
//   const navigate = useNavigate();
//   const { user, refreshProfile } = useAuth();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     (async () => {
//       try {
//         await refreshProfile();
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [refreshProfile]);

//   const bgImageUrl = "/assets/jack-hunter-1L4E_lsIb9Q-unsplash%201.png";

//   return (
//     <div
//       className="relative bg-black text-[#F5F5F5] min-h-screen overflow-hidden pt-[140px] pb-[50px]"
//       style={{ fontFamily: "'Roboto', sans-serif" }}
//     >
//       <div
//         className="absolute top-[-3px] left-[-75px] w-[662px] h-[1100px] z-[1] bg-cover bg-no-repeat"
//         style={{ backgroundImage: `url('${bgImageUrl}')` }}
//       />

//       <div className="absolute top-0 right-[60%] w-1/2 h-full z-[2] bg-[linear-gradient(to_left,rgba(0,0,0,1)_20%,rgba(0,0,0,0)_100%)]" />
//       <div className="absolute bottom-0 left-0 w-full h-1/2 z-[2] bg-[linear-gradient(to_top,rgba(0,0,0,1)_20%,rgba(0,0,0,0)_100%)]" />

//       <button
//         type="button"
//         onClick={() => navigate(-1)}
//         className="absolute top-[140px] left-10 z-20 flex items-center gap-[6px] px-5 py-[10px] bg-transparent border border-[#F5F5F5] rounded-[30px] text-[#F5F5F5] hover:bg-[rgba(245,245,245,0.1)] transition-colors"
//         style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18 }}
//       >
//         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
//         <span style={{ lineHeight: 1 }}>Back</span>
//       </button>

//       <div className="relative z-10 flex flex-col items-center px-8">
//         <div className="text-center mb-20">
//           <div className="relative w-[100px] h-[100px] mx-auto mb-4">
//             <div className="absolute -z-10 w-[400px] h-[400px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(217,217,217,0.1)_0%,rgba(115,115,115,0)_100%)]" />
//             <img src={user?.image_url ?? "/assets/default-profile-icon.png"} alt="Profile" className="relative z-[1] w-full h-full rounded-full object-cover" />
//             <button type="button" aria-label="Edit profile picture" className="absolute bottom-0 right-0 w-[28px] h-[28px] rounded-full flex items-center justify-center bg-[#F5F5F5] border-[2px] border-black cursor-pointer p-0 z-[2]">
//               <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M13.5 0L12 1.5L16.5 6L18 4.5L13.5 0ZM10.5 3L0 13.5V18H4.5L15 7.5L10.5 3Z" fill="black"/></svg>
//             </button>
//           </div>

//           <h2 className="m-0 text-[24px] font-medium" style={{ letterSpacing: "0.01em" }}>{user?.username ?? "-"}</h2>
//           <p className="m-0 text-[14px] text-[#B1B1B1]">{user?.email ?? "-"}</p>
//           {loading && <p className="mt-2 text-sm text-[#B1B1B1]">Memuat profil…</p>}
//         </div>

//         <div className="w-full max-w-[460px] bg-[rgba(217,217,217,0.01)] border border-[#F5F5F5] backdrop-blur-[20px] rounded-[30px] p-[30px] relative z-10">
//           <h3 className="m-0 mb-5 pb-[10px] border-b border-[rgba(177,177,177,0.15)]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, fontWeight: 400 }}>Basic Information</h3>
//           <ul className="list-none p-0 m-0">
//             <li className="flex justify-between items-center py-5 text-[18px] border-b border-[rgba(177,177,177,0.15)]"><span className="text-[#B1B1B1]">Username</span><span className="text-[#F5F5F5]">{user?.username ?? "-"}</span></li>
//             <li className="flex justify-between items-center py-5 text-[18px] border-b border-[rgba(177,177,177,0.15)]"><span className="text-[#B1B1B1]">Email</span><span className="text-[#F5F5F5]">{user?.email ?? "-"}</span></li>
//             <li className="flex justify-between items-center py-5 text-[18px] border-b border-[rgba(177,177,177,0.15)]"><span className="text-[#B1B1B1]">Password</span><span className="text-[#F5F5F5] text-[24px] leading-none">••••••••••</span></li>
//             <li className="flex justify-between items-center py-5 text-[18px]"><span className="text-[#B1B1B1]"></span><a href="/change-password" className="underline text-[#B1B1B1] hover:text-[#F5F5F5] transition-colors text-[18px]">Change Password</a></li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }