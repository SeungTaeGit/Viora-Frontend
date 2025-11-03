import axiosInstance from "../api/axiosInstance";
import type { AuthLoginModel, AuthTokenModel } from "../types/auth.model";

class AuthRepository {
  /**
   * 로그인 API 호출
   * 백엔드는 TokenResponse 객체 (JSON)를 반환합니다.
   */
  async login(loginModel: AuthLoginModel): Promise<AuthTokenModel> {
    const response = await axiosInstance.post<AuthTokenModel>("/auth/login", loginModel);
    return response.data; // { accessToken: "eyJhbG..." } 객체 반환
  }
}

export const authRepository = new AuthRepository();