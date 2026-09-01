export interface LoginResponse {
  accessToken: string;
  admin: { id: string; name: string; email: string; role: string };
}
