import { FilterQuery } from 'mongoose';
import { IMapper } from '../../domain/common/maper.interface';
import { User } from '../../domain/entities/user.entity';
import { UserDocument } from '../schemas/user.schema';

export class UserMapper implements IMapper<User, UserDocument> {
  toDomain(raw: UserDocument): User {
    const { password, ...rest } = raw; // Exclude password from the domain entity
    return {
      id: raw._id.toString(),
      password: null,
      ...rest,
    };
  }

  toPersistence(domain: User): UserDocument {
    return {
      _id: domain.id,
      ...domain,
    } as UserDocument;
  }

  toPersistFilter(
    domain?: FilterQuery<Partial<User>>,
  ): FilterQuery<Partial<UserDocument>> {
    const filter: FilterQuery<Partial<UserDocument>> = {};
    if (!domain) return filter;
    if (domain.email) filter.email = domain.email;
    if (domain.id) filter._id = domain.id;
    return filter;
  }

  toPersistUpdate(domain: Partial<User>): Partial<UserDocument> {
    const update: Partial<UserDocument> = {};
    if (domain.email) update.email = domain.email;
    if (domain.password) update.password = domain.password;
    return update;
  }
}
