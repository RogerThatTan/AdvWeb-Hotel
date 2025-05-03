import { Module } from '@nestjs/common';
import { HashController } from './hash.controller';
import { HashService } from './hash.service';
import { HashingProvider } from './hashing.provider';
import { BcryptProvider } from './bcrypt.provider';

@Module({
  controllers: [HashController],
  providers: [
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },

    HashService,
  ],
  exports: [HashService, HashingProvider],
})
export class HashModule {}
