export interface IAuthRepository {
  validateUser(email: string, password: string): Promise<boolean>;
  sign(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string } | null>;
  refresh(
    userId: string,
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string } | null>;
}

export const AUTH_REPOSITORY = Symbol('AUTH_REPOSITORY');
