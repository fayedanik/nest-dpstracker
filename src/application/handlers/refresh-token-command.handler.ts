import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommandResponse } from 'src/shared/generic-class/command-response.class';
import { RefreshTokenCommand } from '../commands/refresh-token.command';
import {
  AUTH_REPOSITORY,
  type IAuthRepository,
} from '../ports/auth-repository.interface';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenCommandHandler
  implements ICommandHandler<RefreshTokenCommand, CommandResponse<unknown>>
{
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly authRepository: IAuthRepository,
  ) {}
  //   execute(command: RefreshTokenCommand): Promise<CommandResponse<unknown>> {
  //     try {
  //       //const response = await
  //     } catch (error: any) {}
  //   }
}
