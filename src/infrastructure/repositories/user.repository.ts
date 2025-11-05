import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as argon from 'argon2';
import { Model, RootFilterQuery } from 'mongoose';
import { IUserRepository } from '../../application/ports/user-repository.interface';
import { User } from '../../domain/entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';
import { UserDocument } from '../schemas/user.schema';
import { GenericRepository } from './generic.repository';
import { GetUsersQuery } from '../../application/queries/get-users.query';

@Injectable()
export class UserRepository
  extends GenericRepository<User, UserDocument>
  implements IUserRepository
{
  constructor(
    @InjectModel(UserDocument.name)
    private readonly userModel: Model<UserDocument>,
    private readonly userMapper: UserMapper,
  ) {
    super(userModel, userMapper);
  }

  async getUsers(userIds: string[], query: GetUsersQuery): Promise<User[]> {
    try {
      const filter: RootFilterQuery<UserDocument> = {};
      if (userIds.length > 0) {
        filter._id = { $in: userIds };
      }
      if (query?.searchText) {
        const words = query.searchText.trim().split(' ');
        filter.$and = words.map((word) => ({
          displayName: { $regex: new RegExp(word, 'i') },
        }));
      }
      let cmd = this.userModel.find(filter);
      if (query?.pageLimit) {
        cmd = cmd
          .limit(query.pageLimit)
          .skip(query.pageLimit * Math.max(0, (query.pageIndex ?? 0) - 1));
      }
      const response = await cmd.exec();
      return response.map((user) => this.userMapper.toDomain(user.toObject()));
    } catch (err) {
      return [];
    }
  }
  async getUserPasswordHash(email: string): Promise<string | null> {
    try {
      const user = await this.userModel
        .findOne({ email: email })
        .select('+password')
        .exec();
      return user ? user.password : null;
    } catch (error) {
      return null;
    }
  }

  async save(user: User): Promise<boolean> {
    try {
      if (!user.password) {
        return false;
      }
      const passwordHash = await argon.hash(user.password);
      const savedUser = await this.insert({
        ...user,
        password: passwordHash,
        displayName: user.firstName + ' ' + user.lastName,
      });
      return !!savedUser;
    } catch (error: any) {
      return false;
    }
  }
}
