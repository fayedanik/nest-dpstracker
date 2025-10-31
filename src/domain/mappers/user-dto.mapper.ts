import { Injectable } from '@nestjs/common';
import { UserResponseDto } from '../../presentation/dtos/response-dtos/user-response.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UserDtoMapper {
  static toDto(user: User): UserResponseDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      displayName: user.displayName
        ? user.displayName
        : user.firstName + ' ' + user.lastName,
      roles: user.roles,
      createdAt: user.createdAt?.toString(),
      isActive: user.isActive,
    };
  }
}
