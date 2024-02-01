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
import { EditRecipientUseCase } from '@/domain/main/application/use-cases/edit-recipient';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';

const editRecipientBodySchema = z.object({
  name: z.string(),
  state: z.string(),
  city: z.string(),
  street: z.string(),
  number: z.string(),
  zipCode: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(editRecipientBodySchema);

type EditRecipientBodySchema = z.infer<typeof editRecipientBodySchema>;

@Controller('/recipients/:id')
export class EditRecipientController {
  constructor(private editRecipient: EditRecipientUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditRecipientBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id') recipientId: string,
  ) {
    const { name, state, city, street, number, zipCode } = body;
    const userId = user.sub;

    const result = await this.editRecipient.execute({
      userId: userId,
      recipientId,
      name,
      state,
      city,
      street,
      number,
      zipCode,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
