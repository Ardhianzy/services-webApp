// src/features/auth/types.ts
export type LoginPayload = {
  username: string;
  password: string;
};

export type User = {
  id?: number;
  admin_Id?: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  image?: string | null;
  [key: string]: any;
};