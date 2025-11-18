import { v4 as uuidv4 } from 'uuid';
import { Role } from '../../shared/consts/role.const';
import { EntityBase } from './entity-base.entity';
export class User extends EntityBase {
  displayName: string;
  isActive: boolean;
  activationDate: Date | null;
  constructor(
    public email: string,
    public firstName: string,
    public lastName: string,
    public password: string | null,
    public phoneNumber: string,
    public roles: string[] = [Role.Anonymous, Role.User],
  ) {
    super(uuidv4({}));
  }
}
