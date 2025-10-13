export type User = {
  id?: string | number;
  username: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  image_url?: string | null;
};

export type LoginPayload = { username: string; password: string };
export type RegisterPayload = {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  image?: File | null;
};

export type LoginResponseShape =
  | { token: string }
  | { data: { token: string } }
  | { access_token: string };