import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserDocument,
  UserSchema,
} from '../infrastructure/schemas/user.schema';
import {
  SessionDocument,
  SessionSchema,
} from '../infrastructure/schemas/session.schema';
import { USER_REPOSITORY } from '../application/ports/user-repository.interface';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { UserMapper } from '../infrastructure/mappers/user.mapper';
import { CoreModule } from './core.module';

@Module({
  imports: [
    CoreModule,
    MongooseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
      { name: SessionDocument.name, schema: SessionSchema },
    ]),
  ],
  providers: [
    UserMapper,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  exports: [MongooseModule, USER_REPOSITORY],
})
export class UserModule {}
