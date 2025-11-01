// src/types/auth.model.ts
export interface AuthLoginModel {
  email: string;
  password: string;
}

export interface AuthTokenModel {
  accessToken: string;
}