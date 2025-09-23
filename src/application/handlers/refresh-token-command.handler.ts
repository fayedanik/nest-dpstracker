import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommandResponse } from 'src/shared/generic-class/command-response.class';
import { RefreshTokenCommandResponseDto } from '../../presentation/dtos/response-dtos/refresh-command-response.dto';
import { ErrorMessageConst } from '../../shared/consts/error.const';
import { SuccessMessageConst } from '../../shared/consts/success.const';
import { RefreshTokenCommand } from '../commands/refresh-token.command';
import {
  AUTH_REPOSITORY,
  type IAuthRepository,
} from '../ports/auth-repository.interface';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenCommandHandler
  implements
    ICommandHandler<
      RefreshTokenCommand,
      CommandResponse<RefreshTokenCommandResponseDto>
    >
{
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly authRepository: IAuthRepository,
  ) {}
  async execute(
    command: RefreshTokenCommand,
  ): Promise<CommandResponse<RefreshTokenCommandResponseDto>> {
    try {
      const response = await this.authRepository.refresh(
        command.userId,
        command.refreshToken,
      );
      if (!response || !response.accessToken) {
        return CommandResponse.failure(ErrorMessageConst.INVALID_ACCESS_TOKEN);
      }
      return new CommandResponse(
        SuccessMessageConst.ACCESS_TOKEN_GENERATION_SUCCESS,
        true,
        {
          access_token: response?.accessToken,
          refresh_token: response?.refreshToken,
        },
      );
    } catch (error: any) {
      return CommandResponse.failure(ErrorMessageConst.INVALID_ACCESS_TOKEN);
    }
  }
}
