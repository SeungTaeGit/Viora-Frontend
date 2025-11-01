import axiosInstance from "../api/axiosInstance";
// import { AuthLoginModel } from "../types/auth.model";

class AuthRepository {
  /**
   * 로그인 API 호출
   * 백엔드는 JSON 객체가 아닌 순수 토큰 문자열(string)을 반환합니다.
   */
  async login(loginModel: AuthLoginModel): Promise<string> {
    const response = await axiosInstance.post<string>("/auth/login", loginModel);
    return response.data; // response.data는 이제 "eyJhbG..." 문자열입니다.
  }
}

export const authRepository = new AuthRepository();