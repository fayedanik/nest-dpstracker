import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SecurityContextProvider } from '../core/SecurityContext/security-context-provider.service';
import { SecurityContextInterceptor } from '../core/SecurityContext/security-context.interceptor';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserDocument,
  UserSchema,
} from '../infrastructure/schemas/user.schema';
import {
  SessionDocument,
  SessionSchema,
} from '../infrastructure/schemas/session.schema';

@Module({
  imports: [],
  exports: [SecurityContextProvider],
  providers: [
    SecurityContextProvider,
    {
      provide: APP_INTERCEPTOR,
      useClass: SecurityContextInterceptor,
    },
  ],
})
export class CoreModule {}
