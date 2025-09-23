import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { ISecurityContext } from '../../core/SecurityContext/security-context.interface';
import { IAppConfig } from '../interfaces/app-config.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private config: ConfigService<IAppConfig>,
    //private readonly securityContext: SecurityContextProvider,
  ) {
    const jwtSecret = config.get<string>('JWT_ACCESS_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_ACCESS_SECRET is not defined in configuration');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    });
  }
  validate(payload: any): unknown {
    if (!payload || !payload.sub) {
      return null;
    }
    const context = {
      userId: payload.sub,
      email: payload.email,
      roles: payload.roles,
      tenantId: payload.tenantId,
    } as ISecurityContext;
    //console.log(this.securityContext);
    //this.securityContext.setSecurityContext(context);
    return context;
  }
}
