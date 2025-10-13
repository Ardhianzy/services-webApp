// import type { ChangeEvent, Dispatch, SetStateAction } from "react";
// import type { SignUpErrors, SignUpFormData } from "@/features/auth/types/signup";

// type Props = {
//   formData: SignUpFormData;
//   setFormData: Dispatch<SetStateAction<SignUpFormData>>;
//   errors: SignUpErrors;
// };

// export default function SignUpStepBasicInfo({ formData, setFormData, errors }: Props) {
//   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const key = e.target.id as keyof SignUpFormData;
//     setFormData(prev => ({ ...prev, [key]: e.target.value }));
//   };

//   const days = Array.from({ length: 31 }, (_, i) => `${i + 1}`);
//   const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
//   const currentYear = new Date().getFullYear();
//   const years = Array.from({ length: 100 }, (_, i) => `${currentYear - i}`);

//   return (
//     <>
//       <h1 className="signup-title">BASIC INFORMATION</h1>
//       <p className="signup-subtitle">Enter your birthday and other information</p>

//       <div className={`form-group ${errors.birthday ? "error" : ""}`}>
//         <div className="birthday-input-container" aria-invalid={!!errors.birthday}>
//           <div className="birthday-segment">
//             <select
//               id="day"
//               value={formData.day}
//               onChange={handleChange}
//               // required
//               aria-label="Day"
//               autoComplete="bday-day"
//             >
//               <option value="" disabled></option>
//               {days.map(d => <option key={d} value={d}>{d}</option>)}
//             </select>
//             <label htmlFor="day" className="segment-label">Date</label>
//           </div>

//           <div className="birthday-segment">
//             <select
//               id="month"
//               value={formData.month}
//               onChange={handleChange}
//               // required
//               aria-label="Month"
//               autoComplete="bday-month"
//             >
//               <option value="" disabled></option>
//               {months.map((m, i) => <option key={m} value={`${i + 1}`}>{m}</option>)}
//             </select>
//             <label htmlFor="month" className="segment-label">Month</label>
//           </div>

//           <div className="birthday-segment">
//             <select
//               id="year"
//               value={formData.year}
//               onChange={handleChange}
//               // required
//               aria-label="Year"
//               autoComplete="bday-year"
//             >
//               <option value="" disabled></option>
//               {years.map(y => <option key={y} value={y}>{y}</option>)}
//             </select>
//             <label htmlFor="year" className="segment-label">Year</label>
//           </div>
//         </div>
//         {errors.birthday && <span className="error-message">{errors.birthday}</span>}
//       </div>

//       <div className={`form-group ${errors.gender ? "error" : ""}`}>
//         <select
//           id="gender"
//           className="form-input"
//           value={formData.gender}
//           onChange={handleChange}
//           // required
//           aria-invalid={!!errors.gender}
//           aria-describedby={errors.gender ? "gender-error" : undefined}
//         >
//           <option value="" disabled></option>
//           <option value="male">Male</option>
//           <option value="female">Female</option>
//           <option value="other">Other</option>
//           <option value="prefer_not_to_say">Prefer not to say</option>
//         </select>
//         <label htmlFor="gender" className="form-label">Gender</label>
//         {errors.gender && <span id="gender-error" className="error-message">{errors.gender}</span>}
//       </div>

//       <div className="form-group">
//         <input
//           type="tel"
//           id="phoneNumber"
//           className="form-input"
//           value={formData.phoneNumber}
//           onChange={handleChange}
//           placeholder=" "
//           inputMode="tel"
//           autoComplete="tel"
//         />
//         <label htmlFor="phoneNumber" className="form-label">Phone number (optional)</label>
//       </div>

//       <div className={`form-group ${errors.country ? "error" : ""}`}>
//         <select
//           id="country"
//           className="form-input"
//           value={formData.country}
//           onChange={handleChange}
//           // required
//           autoComplete="country-name"
//           aria-invalid={!!errors.country}
//           aria-describedby={errors.country ? "country-error" : undefined}
//         >
//           <option value="" disabled></option>
//           <option value="Indonesia">Indonesia</option>
//           <option value="Malaysia">Malaysia</option>
//           <option value="Singapore">Singapore</option>
//           <option value="United States">United States</option>
//         </select>
//         <label htmlFor="country" className="form-label">Country</label>
//         {errors.country && <span id="country-error" className="error-message">{errors.country}</span>}
//       </div>

//       <div className={`form-group ${errors.city ? "error" : ""}`}>
//         <input
//           type="text"
//           id="city"
//           className="form-input"
//           value={formData.city}
//           onChange={handleChange}
//           // required
//           placeholder=" "
//           autoComplete="address-level2"
//           aria-invalid={!!errors.city}
//           aria-describedby={errors.city ? "city-error" : undefined}
//         />
//         <label htmlFor="city" className="form-label">City / County</label>
//         {errors.city && <span id="city-error" className="error-message">{errors.city}</span>}
//       </div>
//     </>
//   );
// }