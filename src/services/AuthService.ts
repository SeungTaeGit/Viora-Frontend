import { authRepository } from "../repositories/AuthRepository";
// import { AuthLoginItem, AuthTokenItem } from "../types/auth.item";
// import { AuthLoginModel } from "../types/auth.model";

class AuthService {
  /**
   * itemToModel (로그인 요청 시)
   */
  private itemToModel(item: AuthLoginItem): AuthLoginModel {
    return {
      email: item.email,
      password: item.password,
    };
  }

  /**
   * 로그인 비즈니스 로직
   */
  async login(loginItem: AuthLoginItem): Promise<AuthTokenItem> {
    // 1. UI용 데이터를 API용 데이터로 변환
    const loginModel = this.itemToModel(loginItem);
    
    // 2. Repository에 API 호출 요청 (이제 tokenString을 받음)
    const tokenString = await authRepository.login(loginModel);
    
    // 3. API로부터 받은 순수 문자열을 UI용 Item 객체로 '번역'
    const tokenItem: AuthTokenItem = {
      accessToken: tokenString,
    };

    return tokenItem;
  }
}

export const authService = new AuthService();
