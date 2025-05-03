import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { HashModule } from 'src/hash/hash.module';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from 'src/auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from 'src/auth/guards/access-token/access-token.guard';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    // use this guard if you want to protect all routes in this module with JWT authentication (Naimur)
    // {
    //   provide: APP_GUARD,
    //   useClass: AccessTokenGuard,
    // },
  ],
  imports: [
    TypeOrmModule.forFeature([User]),
    HashModule,
    // ConfigModule.forFeature(jwtConfig),
    // JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  exports: [UserService],
})
export class UserModule {}
