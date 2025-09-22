import { Injectable } from '@nestjs/common';
import { CookieOptions, Request, Response } from 'express';

@Injectable()
export class CookieService {
  private defaultOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.TENANT === 'production',
    sameSite: 'strict' as const,
    path: '/',
  };
  setCookie(
    res: Response,
    name: string,
    val: string,
    options: Partial<CookieOptions> = {},
  ) {
    res.cookie(name, val, { ...this.defaultOptions, ...options });
  }
  clearCookie(
    res: Response,
    name: string,
    options: Partial<CookieOptions> = {},
  ) {
    res.clearCookie(name, { ...this.defaultOptions, ...options });
  }

  getCookie(req: Request, name: string): string | undefined {
    return req.cookies?.[name] as string | undefined;
  }

  getAllCookies(req: Request): Record<string, string> {
    return req.cookies || {};
  }
}
