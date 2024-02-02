import { GetRecipientInfoController } from './controllers/get-recipient-info.controller';
import { Module } from '@nestjs/common';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { DatabaseModule } from '../database/database.module';
import { CreateUserController } from './controllers/create-user.controller';
import { RegisterUserUseCase } from '@/domain/main/application/use-cases/register-user';
import { AuthenticateController } from './controllers/authenticate.controller';
import { AuthenticateUserUseCase } from '@/domain/main/application/use-cases/authenticate-user';
import { CreateRecipientController } from './controllers/create-recipient.controller';
import { RegisterRecipientUseCase } from '@/domain/main/application/use-cases/register-recipient';
import { EditRecipientController } from './controllers/edit-recipient.controller';
import { EditRecipientUseCase } from '@/domain/main/application/use-cases/edit-recipient';
import { DeleteRecipientController } from './controllers/delete-recipient.controller';
import { DeleteRecipientUseCase } from '@/domain/main/application/use-cases/delete-recipient';
import { GetRecipientInfoUseCase } from '@/domain/main/application/use-cases/get-recipient-info';
import { EditUserController } from './controllers/edit-user.controller';
import { EditUserUseCase } from '@/domain/main/application/use-cases/edit-user';
import { DeleteUserController } from './controllers/delete-user.controller';
import { DeleteUserUseCase } from '@/domain/main/application/use-cases/delete-user';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateUserController,
    AuthenticateController,
    CreateRecipientController,
    EditRecipientController,
    DeleteRecipientController,
    GetRecipientInfoController,
    EditUserController,
    DeleteUserController,
  ],
  providers: [
    RegisterUserUseCase,
    AuthenticateUserUseCase,
    RegisterRecipientUseCase,
    EditRecipientUseCase,
    DeleteRecipientUseCase,
    GetRecipientInfoUseCase,
    EditUserUseCase,
    DeleteUserUseCase,
  ],
})
export class HttpModule {}
