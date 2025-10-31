import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SecurityContextProvider } from '../../core/SecurityContext/security-context-provider.service';
import { LogoutCommand } from '../commands/log-out.command';
import {
  AUTH_REPOSITORY,
  type IAuthRepository,
} from '../ports/auth-repository.interface';

@CommandHandler(LogoutCommand)
export class LogoutCommandHandler
  implements ICommandHandler<LogoutCommand, boolean>
{
  constructor(
    private readonly securityContextProvider: SecurityContextProvider,
    @Inject(AUTH_REPOSITORY) private readonly authRepository: IAuthRepository,
  ) {}
  async execute(command: LogoutCommand): Promise<boolean> {
    try {
      const securityContext = this.securityContextProvider.getSecurityContext();
      console.log(securityContext.userId);
      return await this.authRepository.terminateSession(securityContext.userId);
    } catch (err) {
      return false;
    }
  }
}
