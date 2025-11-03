import { authRepository } from "../repositories/AuthRepository";
import type { AuthLoginItem, AuthTokenItem } from "../types/auth.item";
import type { AuthLoginModel, AuthTokenModel } from "../types/auth.model"; // ❗️ AuthTokenModel import

class AuthService {
  private itemToModel(item: AuthLoginItem): AuthLoginModel {
    return {
      email: item.email,
      password: item.password,
    };
  }

  private modelToItem(model: AuthTokenModel): AuthTokenItem {
    return {
      accessToken: model.accessToken,
    };
  }

  async login(loginItem: AuthLoginItem): Promise<AuthTokenItem> {
    // 1. UI용 데이터를 API용 데이터로 변환
    const loginModel = this.itemToModel(loginItem);

    // 2. Repository에 API 호출 요청 (AuthTokenModel 객체를 받음)
    const tokenModel = await authRepository.login(loginModel);

    // 3. API용 데이터를 UI용 데이터로 '번역'
    const tokenItem = this.modelToItem(tokenModel);

    return tokenItem;
  }
}

export const authService = new AuthService();

