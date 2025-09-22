import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { CreatUserCommandHandler } from '../application/handlers/create-user-command.handler';
import { LoginCommandHandler } from '../application/handlers/login-command.handler';
import { AUTH_REPOSITORY } from '../application/ports/auth-repository.interface';
import { USER_REPOSITORY } from '../application/ports/user-repository.interface';
import { UserMaper } from '../infrastructure/mappers/user.mapper';
import { AuthRepository } from '../infrastructure/repositories/auth.repository';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import {
  Session,
  sessionSchema,
} from '../infrastructure/schemas/session.schema';
import {
  UserDocument,
  userSchema,
} from '../infrastructure/schemas/user.schema';
import { IdentityCommandController } from '../presentation/controllers/iam/authenticationCommand.controller';
import { SecurityCommandController } from '../presentation/controllers/uam/securitCommand.controller';
import { SecurityQueryController } from '../presentation/controllers/uam/securityQuery.controller';
import { JwtStrategy } from '../shared/strategy';
import { SharedModule } from './shared.module';
@Module({
  controllers: [
    SecurityCommandController,
    IdentityCommandController,
    SecurityQueryController,
  ],
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: UserDocument.name, schema: userSchema },
      { name: Session.name, schema: sessionSchema },
    ]),
    JwtModule.register({}),
    SharedModule,
  ],
  exports: [],
  providers: [
    UserMaper,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: AUTH_REPOSITORY,
      useClass: AuthRepository,
    },
    CreatUserCommandHandler,
    LoginCommandHandler,
    JwtStrategy,
  ],
})
export class AuthModule {}
