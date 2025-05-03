import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ManagementModule } from '../management/management.module';
import { UserModule } from '../user/user.module';
import { SignInProvider } from './signin.provider';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { HashModule } from 'src/hash/hash.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, SignInProvider],
  exports: [AuthService],
  imports: [
    ManagementModule,
    UserModule,
    HashModule,
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
})
export class AuthModule {}
