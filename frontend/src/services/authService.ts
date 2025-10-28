import api from './api';
import { User, ApiResponse } from '../types';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  tenantName?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  tenant: {
    id: string;
    name: string;
    plan: string;
  };
}

export class AuthService {
  // 用户登录
  async login(loginData: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', loginData);
    return response.data.data;
  }

  // 用户注册
  async register(registerData: RegisterRequest): Promise<LoginResponse> {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/register', registerData);
    return response.data.data;
  }

  // 获取当前用户信息
  async getCurrentUser(): Promise<User> {
    const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');
    return response.data.data.user;
  }

  // 刷新 token
  async refreshToken(): Promise<{ token: string }> {
    const response = await api.post<ApiResponse<{ token: string }>>('/auth/refresh');
    return response.data.data;
  }

  // 修改密码
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await api.put('/auth/password', { oldPassword, newPassword });
  }

  // 登出
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tenantId');
  }

  // 检查是否已登录
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // 获取存储的用户信息
  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // 存储用户信息
  storeUser(user: User, token: string, tenantId: string): void {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    localStorage.setItem('tenantId', tenantId);
  }

  // 获取 token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // 获取租户 ID
  getTenantId(): string | null {
    return localStorage.getItem('tenantId');
  }
}

export const authService = new AuthService();
