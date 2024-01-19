import { RegisterUserUseCase } from '@/domain/main/application/use-cases/register-user';
import { Public } from '@/infra/auth/public';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { UserRole } from '@/core/enum/user-role.enum';
import { UserAlreadyExistsError } from '@/domain/main/application/use-cases/errors/user-already-exists-error';

const createAccountBodySchema = z.object({
  name: z.string(),
  ssn: z.string(),
  password: z.string(),
  role: z.enum([UserRole.Admin, UserRole.Deliveryman]),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller('/accounts')
@Public()
export class CreateAccountController {
  constructor(private registerUser: RegisterUserUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, ssn, password, role } = body;

    const result = await this.registerUser.execute({
      name,
      ssn,
      password,
      role,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
