import type { User, LoginRequest, LoginResponse } from '@/types/commerce';
import { apiClient, setAuthToken, clearAuthToken } from './client';
import { siteConfig } from '@/config/site';

export async function getMe(): Promise<User> {
  return apiClient.get<User>(siteConfig.api.endpoints.authMe);
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const res = await apiClient.post<LoginResponse>(
    siteConfig.api.endpoints.authLogin,
    data,
  );
  if (res.token) {
    setAuthToken(res.token);
  }
  return res;
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post(siteConfig.api.endpoints.authLogout);
  } finally {
    clearAuthToken();
  }
}
