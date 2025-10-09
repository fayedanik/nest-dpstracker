import { User } from '../../domain/entities/user.entity';
import { IRepository } from './generic-repository.interface';

export interface IUserRepository extends IRepository<User> {
  save(user: User): Promise<boolean>;
  getUserPasswordHash(email: string): Promise<string | null>;
  getUsers(): Promise<User[]>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
