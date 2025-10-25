import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import databaseConfig from './config/database.config';
import { AuthModule } from './modules/auth.module';
import { IAppConfig } from './shared/interfaces/app-config.interface';
import { AdminCommandController } from './presentation/controllers/adminCommand.controller';
import { BankAccountModule } from './modules/bankAccount.module';
import { UserModule } from './modules/user.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'dev'}`,
      load: [databaseConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<IAppConfig>) => ({
        uri: config.get<string>('database.uri', { infer: true }),
      }),
    }),
    AuthModule,
    BankAccountModule,
  ],
  exports: [],
  controllers: [AdminCommandController],
  providers: [],
})
export class AppModule {}
