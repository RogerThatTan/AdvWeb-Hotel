import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ManagementModule } from '../management/management.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [ManagementModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {

}
