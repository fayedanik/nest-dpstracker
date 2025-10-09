import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { User } from '../../domain/entities/user.entity';
import { ErrorMessageConst } from '../../shared/consts/error.const';
import { CreateUserCommand } from '../commands/create-user.command';
import {
  type IUserRepository,
  USER_REPOSITORY,
} from '../ports/user-repository.interface';

@CommandHandler(CreateUserCommand)
export class CreatUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
{
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}
  async execute(command: CreateUserCommand): Promise<unknown> {
    try {
      const existingUser = await this.userRepository.getItem({
        email: command.email,
      });
      if (existingUser) {
        throw new BadRequestException(ErrorMessageConst.USER_ALREADY_EXISTS);
      }
      return await this.userRepository.save(
        new User(
          command.email,
          command.firstName ?? '',
          command.lastName ?? '',
          command.password ?? '',
          command.phoneNumber ?? '',
        ),
      );
    } catch (error: any) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: ErrorMessageConst.COULD_NOT_CREATE_USER,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }
}
