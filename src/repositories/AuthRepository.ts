import axiosInstance from '@/api/axiosInstance';
import { LoginRequestModel, LoginResponseModel } from '@/models/AuthModel';

export class AuthRepository {
  async login(request: LoginRequestModel): Promise<LoginResponseModel> {
    const response = await axiosInstance.post<LoginResponseModel>('/auth/login', request);
    return response.data;
  }
}

export const authRepository = new AuthRepository();
