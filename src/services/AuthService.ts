import { authRepository } from '@/repositories/AuthRepository';
import { LoginRequestModel } from '@/models/AuthModel';

export class AuthService {
  async signIn(email: string, password: string): Promise<string> {
    const request: LoginRequestModel = { email, password };
    const response = await authRepository.login(request);
    return response.accessToken;
  }
}

export const authService = new AuthService();
