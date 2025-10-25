import { User } from '../../domain/entities/user.entity';
import { IRepository } from './generic-repository.interface';
import { GetUserQuery } from '../queries/get-user.query';
import { GetUsersQuery } from '../queries/get-users.query';

export interface IUserRepository extends IRepository<User> {
  save(user: User): Promise<boolean>;
  getUserPasswordHash(email: string): Promise<string | null>;
  getUsers(userIds: string[], query?: GetUsersQuery): Promise<User[]>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
