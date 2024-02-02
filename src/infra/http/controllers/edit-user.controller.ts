import { UserRole } from '@/core/enum/user-role.enum';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common';
import { EditUserUseCase } from '@/domain/main/application/use-cases/edit-user';

const editUserBodySchema = z.object({
  name: z.string(),
  ssn: z.string(),
  password: z.string(),
  role: z.enum([UserRole.Admin, UserRole.Deliveryman]),
});

const bodyValidationPipe = new ZodValidationPipe(editUserBodySchema);

type EditUserBodySchema = z.infer<typeof editUserBodySchema>;

@Controller('/users/:id')
export class EditUserController {
  constructor(private editUserUseCase: EditUserUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditUserBodySchema,
    @Param('id') userId: string,
  ) {
    const { name, ssn, password, role } = body;

    const result = await this.editUserUseCase.execute({
      userId: userId,
      name,
      ssn,
      password,
      role,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
