// import { useState, type ChangeEvent, type Dispatch, type SetStateAction, type KeyboardEvent } from "react";
// import type { SignUpErrors, SignUpFormData } from "@/features/auth/types/signup";

// type Props = {
//   formData: SignUpFormData;
//   setFormData: Dispatch<SetStateAction<SignUpFormData>>;
//   errors: SignUpErrors;
// };

// export default function SignUpStepAccountInfo({ formData, setFormData, errors }: Props) {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const key = e.target.id as keyof SignUpFormData;
//     setFormData(prev => ({ ...prev, [key]: e.target.value }));
//   };

//   const onToggleKey = (e: KeyboardEvent<HTMLSpanElement>, toggle: () => void) => {
//     if (e.key === "Enter" || e.key === " ") toggle();
//   };

//   return (
//     <>
//       <h1 className="signup-title">CREATE YOUR ACCOUNT</h1>
//       <p className="signup-subtitle">Enter your email and password</p>

//       <div className={`form-group ${formData.email ? "active" : ""} ${errors.email ? "error" : ""}`}>
//         <input
//           type="email"
//           id="email"
//           className="form-input"
//           value={formData.email}
//           onChange={handleChange}
//           required
//           placeholder=" "
//           autoComplete="email"
//           aria-invalid={!!errors.email}
//           aria-describedby={errors.email ? "email-error" : undefined}
//         />
//         <label htmlFor="email" className="form-label">Email</label>
//         {errors.email && <span id="email-error" className="error-message">{errors.email}</span>}
//       </div>

//       <div className={`form-group ${errors.password ? "error" : ""}`}>
//         <input
//           type={showPassword ? "text" : "password"}
//           id="password"
//           className="form-input"
//           value={formData.password}
//           onChange={handleChange}
//           required
//           placeholder=" "
//           autoComplete="new-password"
//           aria-invalid={!!errors.password}
//           aria-describedby={errors.password ? "password-error" : undefined}
//         />
//         <label htmlFor="password" className="form-label">Password</label>

//         <span
//           className="password-toggle-icon"
//           onClick={() => setShowPassword(prev => !prev)}
//           onKeyDown={(e) => onToggleKey(e, () => setShowPassword(p => !p))}
//           role="button"
//           tabIndex={0}
//           aria-label={showPassword ? "Hide password" : "Show password"}
//         >
//           {showPassword ? (
//             <img src="/assets/visible--eye-eyeball-open-view.png" alt="Hide password" />
//           ) : (
//             <img src="/assets/invisible-2.png" alt="Show password" />
//           )}
//         </span>

//         {errors.password && <span id="password-error" className="error-message">{errors.password}</span>}
//       </div>

//       <div className={`form-group ${errors.confirmPassword ? "error" : ""}`}>
//         <input
//           type={showConfirmPassword ? "text" : "password"}
//           id="confirmPassword"
//           className="form-input"
//           value={formData.confirmPassword}
//           onChange={handleChange}
//           required
//           placeholder=" "
//           autoComplete="new-password"
//           aria-invalid={!!errors.confirmPassword}
//           aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
//         />
//         <label htmlFor="confirmPassword" className="form-label">Confirm password</label>

//         <span
//           className="password-toggle-icon"
//           onClick={() => setShowConfirmPassword(prev => !prev)}
//           onKeyDown={(e) => onToggleKey(e, () => setShowConfirmPassword(p => !p))}
//           role="button"
//           tabIndex={0}
//           aria-label={showConfirmPassword ? "Hide password" : "Show password"}
//         >
//           {showConfirmPassword ? (
//             <img src="/assets/visible--eye-eyeball-open-view.png" alt="Hide password" />
//           ) : (
//             <img src="/assets/invisible-2.png" alt="Show password" />
//           )}
//         </span>

//         {errors.confirmPassword && (
//           <span id="confirmPassword-error" className="error-message">{errors.confirmPassword}</span>
//         )}
//       </div>
//     </>
//   );
// }