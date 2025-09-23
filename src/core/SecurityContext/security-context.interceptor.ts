import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { SecurityContextProvider } from './security-context-provider.service';
import { ISecurityContext } from './security-context.interface';

@Injectable()
export class SecurityContextInterceptor implements NestInterceptor {
  constructor(private readonly securityContext: SecurityContextProvider) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as ISecurityContext;
    return this.securityContext.run(user, () => next.handle());
  }
}
