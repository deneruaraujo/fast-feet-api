import { Module } from '@nestjs/common';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { DatabaseModule } from '../database/database.module';
import { CreateAccountController } from './controllers/create-account.controller.e2e';
import { RegisterUserUseCase } from '@/domain/main/application/use-cases/register-user';
import { AuthenticateController } from './controllers/authenticate.controller.e2e';
import { AuthenticateUserUseCase } from '@/domain/main/application/use-cases/authenticate-user';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [CreateAccountController, AuthenticateController],
  providers: [RegisterUserUseCase, AuthenticateUserUseCase],
})
export class HttpModule {}
