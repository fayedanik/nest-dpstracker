import { Reflector } from '@nestjs/core';
import { Role } from '../consts/role.const';

export const Roles = Reflector.createDecorator<Role[]>();
