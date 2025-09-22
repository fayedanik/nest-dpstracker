import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as argon from 'argon2';
import { Model } from 'mongoose';
import { IUserRepository } from '../../application/ports/user-repository.interface';
import { User } from '../../domain/entities/user.entity';
import { UserMaper } from '../mappers/user.mapper';
import { UserDocument } from '../schemas/user.schema';
import { MongoBaseRepository } from './generic.repository';

@Injectable()
export class UserRepository
  extends MongoBaseRepository<User, UserDocument>
  implements IUserRepository
{
  constructor(
    @InjectModel(UserDocument.name)
    private readonly userModel: Model<UserDocument>,
    private userMapper: UserMaper,
  ) {
    super(userModel, userMapper);
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
      const savedUser = await this.insert({ ...user, password: passwordHash });
      return savedUser ? true : false;
    } catch (error: any) {
      return false;
    }
  }
}
