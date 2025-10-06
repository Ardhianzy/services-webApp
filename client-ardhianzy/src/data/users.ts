// src/data/users.ts
export type UserProfile = {
  username: string;
  email: string;
  profilePicture: string;
};

export const currentUser: UserProfile = {
  username: "HotChocolate33",
  email: "admin@example.com",
  profilePicture: "/assets/ellipse-149.png",
};