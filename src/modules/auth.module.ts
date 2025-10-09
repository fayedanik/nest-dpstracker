import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { CreatUserCommandHandler } from '../application/handlers/create-user-command.handler';
import { GetAppsQueryHandler } from '../application/handlers/get-apps-query.handler';
import { GetUserQueryHandler } from '../application/handlers/get-user-query.handler';
import { GetUsersQueryHandler } from '../application/handlers/get-users-query.handler';
import { LogoutCommandHandler } from '../application/handlers/log-out-command.handler';
import { LoginCommandHandler } from '../application/handlers/login-command.handler';
import { RefreshTokenCommandHandler } from '../application/handlers/refresh-token-command.handler';
import { AUTH_REPOSITORY } from '../application/ports/auth-repository.interface';
import { USER_REPOSITORY } from '../application/ports/user-repository.interface';
import { UserMapper } from '../infrastructure/mappers/user.mapper';
import { AuthRepository } from '../infrastructure/repositories/auth.repository';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import {
  Session,
  SessionDocument,
  SessionSchema,
} from '../infrastructure/schemas/session.schema';
import {
  UserDocument,
  UserSchema,
} from '../infrastructure/schemas/user.schema';
import { IdentityCommandController } from '../presentation/controllers/iam/authenticationCommand.controller';
import { SecurityCommandController } from '../presentation/controllers/uam/securitCommand.controller';
import { SecurityQueryController } from '../presentation/controllers/uam/securityQuery.controller';
import { JwtStrategy } from '../shared/strategy';
import { CoreModule } from './core.module';
import { SharedModule } from './shared.module';
@Module({
  controllers: [
    SecurityCommandController,
    IdentityCommandController,
    SecurityQueryController,
  ],
  imports: [
    CoreModule,
    CqrsModule,
    MongooseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
      { name: SessionDocument.name, schema: SessionSchema },
    ]),
    JwtModule.register({}),
    SharedModule,
  ],
  exports: [],
  providers: [
    UserMapper,
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
    LogoutCommandHandler,
    RefreshTokenCommandHandler,
    GetAppsQueryHandler,
    GetUsersQueryHandler,
    GetUserQueryHandler,
    JwtStrategy,
  ],
})
export class AuthModule {}
