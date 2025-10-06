import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import type { SignUpErrors, SignUpFormData } from "@/features/auth/types/signup";

type Props = {
  formData: SignUpFormData;
  setFormData: Dispatch<SetStateAction<SignUpFormData>>;
  errors: SignUpErrors;
};

export default function SignUpStepName({ formData, setFormData, errors }: Props) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const key = e.target.id as keyof SignUpFormData;
    setFormData(prev => ({ ...prev, [key]: e.target.value }));
  };

  return (
    <>
      <h1 className="signup-title">REGISTER ACCOUNT</h1>
      <p className="signup-subtitle">Enter your name</p>

      <div className={`form-group ${errors.firstName ? "error" : ""}`}>
        <input
          type="text"
          id="firstName"
          className="form-input"
          value={formData.firstName}
          onChange={handleChange}
          required
          placeholder=" "
          autoComplete="given-name"
          aria-invalid={!!errors.firstName}
          aria-describedby={errors.firstName ? "firstName-error" : undefined}
        />
        <label htmlFor="firstName" className="form-label">Name</label>
        {errors.firstName && (
          <span id="firstName-error" className="error-message">{errors.firstName}</span>
        )}
      </div>

      <div className="form-group">
        <input
          type="text"
          id="lastName"
          className="form-input"
          value={formData.lastName}
          onChange={handleChange}
          placeholder=" "
          autoComplete="family-name"
        />
        <label htmlFor="lastName" className="form-label">Last name (optional)</label>
      </div>
    </>
  );
}