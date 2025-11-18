import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommandResponse } from '../../shared/generic-class/command-response.class';
import { ActivateUserCommand } from '../commands/activate-user.command';
import { Inject } from '@nestjs/common';
import {
  type IUserRepository,
  USER_REPOSITORY,
} from '../ports/user-repository.interface';
import { ErrorMessageConst } from '../../shared/consts/error.const';

@CommandHandler(ActivateUserCommand)
export class ActivateUserCommandHandler
  implements ICommandHandler<ActivateUserCommand, CommandResponse<boolean>>
{
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    command: ActivateUserCommand,
  ): Promise<CommandResponse<boolean>> {
    try {
      const user = await this.userRepository.getItem({ id: command.userId });
      if (!user) {
        return CommandResponse.failure(ErrorMessageConst.CONTENT_NOT_FOUND);
      }
      if (user.isActive) {
        return CommandResponse.failure(
          ErrorMessageConst.USER_ALREADY_ACTIVATED,
        );
      }
      const response = await this.userRepository.activateUser(command.userId);
      return response ? CommandResponse.success() : CommandResponse.failure();
    } catch (err) {
      return CommandResponse.failure();
    }
  }
}
