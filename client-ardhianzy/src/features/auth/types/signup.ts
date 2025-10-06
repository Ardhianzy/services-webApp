export type SignUpFormData = {
  firstName: string;
  lastName: string;

  day: string;
  month: string;
  year: string;
  gender: "" | "male" | "female" | "other" | "prefer_not_to_say";
  phoneNumber: string;
  country: string;
  city: string;

  email: string;
  password: string;
  confirmPassword: string;
};

export type SignUpErrors = Partial<{
  firstName: string;
  birthday: string;
  gender: string;
  country: string;
  city: string;
  email: string;
  password: string;
  confirmPassword: string;
}>;