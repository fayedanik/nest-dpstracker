import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommandResponseDto } from '../../presentation/dtos/response-dtos/login-command-response.dto';
import { ErrorMessageConst } from '../../shared/consts/error.const';
import { SuccessMessageConst } from '../../shared/consts/success.const';
import { CommandResponse } from '../../shared/generic-class/command-response.class';
import { LoginCommand } from '../commands/login.command';
import {
  AUTH_REPOSITORY,
  type IAuthRepository,
} from '../ports/auth-repository.interface';

@CommandHandler(LoginCommand)
export class LoginCommandHandler
  implements
    ICommandHandler<LoginCommand, CommandResponse<LoginCommandResponseDto>>
{
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly authRepository: IAuthRepository,
  ) {}
  async execute(
    command: LoginCommand,
  ): Promise<CommandResponse<LoginCommandResponseDto>> {
    try {
      const response = await this.authRepository.sign(
        command.email,
        command.password,
      );
      if (!response || !response.accessToken || !response.refreshToken) {
        return CommandResponse.failure(ErrorMessageConst.INVALID_CREDENTIALS);
      }
      return new CommandResponse(SuccessMessageConst.LOGIN_SUCCESSFUL, true, {
        access_token: response.accessToken,
        refresh_token: response.refreshToken,
      });
    } catch (error: any) {
      return CommandResponse.failure(ErrorMessageConst.INVALID_CREDENTIALS);
    }
  }
}
