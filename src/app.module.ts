import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { UsersModule } from './modules/users/users.module';
import typeormConfig from './config/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    UsersModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {} 