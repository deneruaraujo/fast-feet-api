import { Module } from '@nestjs/common';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { DatabaseModule } from '../database/database.module';
import { CreateAccountController } from './controllers/create-account.controller.e2e';
import { RegisterUserUseCase } from '@/domain/main/application/use-cases/register-user';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [CreateAccountController],
  providers: [RegisterUserUseCase],
})
export class HttpModule {}
