// // src/features/auth/pages/SignUpPage.tsx
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// import SignUpStepName from "@/features/auth/components/signup/SignUpStepName";
// import SignUpStepBasicInfo from "@/features/auth/components/signup/SignUpStepBasicInfo";
// import SignUpStepAccountInfo from "@/features/auth/components/signup/SignUpStepAccountInfo";

// import type { SignUpFormData, SignUpErrors } from "@/features/auth/types/signup";
// import { register as registerApi } from "@/features/auth/api";

// import googleLogo from "/assets/google-logos-by-hrhasnai-1.png";

// export default function SignUpPage() {
//   const [step, setStep] = useState<number>(1);
//   const totalSteps = 3;
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState<SignUpFormData>({
//     firstName: "",
//     lastName: "",
//     day: "",
//     month: "",
//     year: "",
//     gender: "",
//     phoneNumber: "",
//     country: "",
//     city: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [errors, setErrors] = useState<SignUpErrors>({});
//   const [submitting, setSubmitting] = useState(false);

//   const handleNextClick = async () => {
//     const newErrors: SignUpErrors = {};
//     let isError = false;

//     if (step === 1) {
//       if (!formData.firstName) {
//         newErrors.firstName = "First name is required";
//         isError = true;
//       }
//     } else if (step === 3) {
//       if (!formData.email) {
//         newErrors.email = "Email is required";
//         isError = true;
//       } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//         newErrors.email = "Email address is invalid";
//         isError = true;
//       }
//       if (!formData.password) {
//         newErrors.password = "Password is required";
//         isError = true;
//       }
//       if (formData.password !== formData.confirmPassword) {
//         newErrors.confirmPassword = "Passwords do not match";
//         isError = true;
//       }
//     }

//     setErrors(newErrors);

//     if (!isError) {
//       if (step < totalSteps) setStep(step + 1);
//       else await handleFinalSubmit();
//     }
//   };

//   const handleFinalSubmit = async () => {
//     setSubmitting(true);
//     try {
//       await registerApi({
//         first_name: formData.firstName,
//         last_name: formData.lastName,
//         username: formData.email,
//         password: formData.password,
//       });
//       alert("Registration successful! Please login.");
//       navigate("/login");
//     } catch (e: any) {
//       alert(e?.message || "Registration failed");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div
//       className="relative w-full min-h-screen bg-black flex justify-center items-center"
//       style={{ fontFamily: "'Roboto', sans-serif" }}
//     >
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
//         @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap');
//         .form-group { position: relative; margin-bottom: 35px; }
//         .form-input { transition: border-color 0.2s ease; }
//         .form-label { position: absolute; left: 15px; top: 13px; font-size: 14px; color: rgba(245,245,245,0.5); pointer-events: none; transition: all .2s ease; }
//         .form-input:focus + .form-label, .form-input:not(:placeholder-shown) + .form-label { top: -10px; left: 12px; font-size: 12px; color: #FFA4A4; background: #040404; padding: 0 5px; }
//         .form-group.error .form-input { border-color: #FFA4A4; }
//         .form-group.error .form-label { color: #FFA4A4; }
//         .error-message { position: absolute; top: 48px; left: 0; padding-left: 15px; display: flex; align-items: center; color: #FFA4A4; font-size: 11px; }
//         .error-message::before { content: '⚠️'; margin-right: 5px; font-size: 14px; }
//         .birthday-input-container { display: flex; border: 1px solid #F5F5F5; border-radius: 30px; height: 45px; transition: border-color .2s ease; position: relative; }
//         .birthday-segment { flex: 1; position: relative; display: flex; align-items: center; }
//         .birthday-segment:not(:last-child) { border-right: 1px solid rgba(245,245,245,.5); }
//         .birthday-segment select { width: 100%; height: 100%; background: transparent; color: #F5F5F5; border: none; -webkit-appearance: none; appearance: none; padding: 1px 5px 0 5px; font-size: 16px; outline: none; position: relative; z-index: 2; text-align: center; text-align-last: center; }
//         .segment-label { position: absolute; left: 15px; top: 13px; font-size: 14px; color: rgba(245,245,245,.5); pointer-events: none; transition: all .2s ease; z-index: 1; }
//         .birthday-segment select:focus + .segment-label, .birthday-segment select:valid + .segment-label { top: -10px; left: 12px; font-size: 12px; color: #B1B1B1; background: #040404; padding: 0 5px; z-index: 3; }
//         .birthday-segment::after { content: ''; position: absolute; right: 15px; top: 50%; transform: translateY(-50%); width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 5px solid #F5F5F5; pointer-events: none; z-index: 1; }
//         .password-toggle-icon { position: absolute; right: 20px; top: 50%; transform: translateY(-50%); color: #F5F5F5; cursor: pointer; font-size: 12px; font-weight: 500; user-select: none; }
//         .form-group input[type="password"], .form-group input[type="text"].form-input { padding-right: 60px; }
//         .form-group.active .form-input { border-color: #4B7DFD; }
//         .form-group.active .form-label { color: #4B7DFD; }
//         select.form-input { -webkit-appearance: none; appearance: none; padding: 12px 35px 12px 15px; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23F5F5F5' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 15px center; }
//         select:required:invalid { color: rgba(245,245,245,.5); }
//         option { background: #fff; color: #000; }
//       `}</style>

//       <div className="absolute left-[150px] top-0 w-[700px] h-screen z-[1] bg-[url('/assets/jack-hunter-1L4E_lsIb9Q-unsplash_1.png')] bg-cover bg-no-repeat bg-center" />
//       <div className="absolute left-0 top-0 w-[30%] h-full z-[2] bg-[linear-gradient(to_right,rgba(0,0,0,1)_30%,rgba(0,0,0,0)_100%)]" />
//       <div className="absolute right-[55rem] top-0 w-[30%] h-full z-[2] bg-[linear-gradient(to_left,rgba(0,0,0,1)_30%,rgba(0,0,0,0)_100%)]" />

//       <div className="box-border relative z-10 w-[474px] bg-[rgba(225,225,225,0.05)] border border-[#F5F5F5] [backdrop-filter:blur(10px)] [-webkit-backdrop-filter:blur(10px)] rounded-[30px] pt-10 px-10 pb-[30px] flex flex-col items-center">
//         <form onSubmit={(e) => e.preventDefault()} className="w-full flex flex-col">
//           {step === 1 && <SignUpStepName formData={formData} setFormData={setFormData} errors={errors} />}
//           {step === 2 && <SignUpStepBasicInfo formData={formData} setFormData={setFormData} errors={errors} />}
//           {step === 3 && <SignUpStepAccountInfo formData={formData} setFormData={setFormData} errors={errors} />}

//           <button
//             type="button"
//             onClick={handleNextClick}
//             disabled={submitting}
//             className="h-[45px] rounded-[30px] cursor-pointer flex justify-center items-center gap-3 transition-opacity duration-300 bg-transparent border border-[#F5F5F5] text-[#F5F5F5] mt-2 disabled:opacity-60"
//             style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18 }}
//             onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
//             onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
//           >
//             {step === totalSteps ? "REGISTER" : "NEXT"}
//           </button>

//           <div className="flex items-center text-[#B1B1B1] my-6 text-[14px]">
//             <div className="flex-1 border-b" style={{ borderColor: "rgba(177,177,177,0.3)" }} />
//             <span className="px-4">or</span>
//             <div className="flex-1 border-b" style={{ borderColor: "rgba(177,177,177,0.3)" }} />
//           </div>

//           <button type="button" className="h-[45px] rounded-[30px] cursor-pointer flex justify-center items-center gap-3 transition-opacity duration-300 bg-[#F5F5F5] text-black border-0"
//             style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18 }}
//             onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
//             onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
//           >
//             <img src={googleLogo} alt="Google logo" className="w-6 h-6" />
//             CONTINUE WITH GOOGLE
//           </button>

//           <p className="text-[14px] text-center text-[#B1B1B1] mt-[30px]">
//             Already have an account?{" "}
//             <Link to="/login" className="no-underline font-medium" style={{ color: "#F5F5F5" }}>
//               Log In
//             </Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }