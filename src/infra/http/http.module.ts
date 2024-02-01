import { Module } from '@nestjs/common';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { DatabaseModule } from '../database/database.module';
import { CreateAccountController } from './controllers/create-account.controller.e2e';
import { RegisterUserUseCase } from '@/domain/main/application/use-cases/register-user';
import { AuthenticateController } from './controllers/authenticate.controller.e2e';
import { AuthenticateUserUseCase } from '@/domain/main/application/use-cases/authenticate-user';
import { CreateRecipientController } from './controllers/create-recipient.controller.e2e';
import { RegisterRecipientUseCase } from '@/domain/main/application/use-cases/register-recipient';
import { EditRecipientController } from './controllers/edit-recipient.controller.e2e';
import { EditRecipientUseCase } from '@/domain/main/application/use-cases/edit-recipient';
import { DeleteRecipientController } from './controllers/delete-recipient.controller.e2e';
import { DeleteRecipientUseCase } from '@/domain/main/application/use-cases/delete-recipient';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateRecipientController,
    EditRecipientController,
    DeleteRecipientController,
  ],
  providers: [
    RegisterUserUseCase,
    AuthenticateUserUseCase,
    RegisterRecipientUseCase,
    EditRecipientUseCase,
    DeleteRecipientUseCase,
  ],
})
export class HttpModule {}
