import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RegisterRecipientUseCase } from '@/domain/main/application/use-cases/register-recipient';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';

const createRecipientBodySchema = z.object({
  name: z.string(),
  state: z.string(),
  city: z.string(),
  street: z.string(),
  number: z.string(),
  zipCode: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});

const bodyValidationPipe = new ZodValidationPipe(createRecipientBodySchema);

type CreateRecipientBodySchema = z.infer<typeof createRecipientBodySchema>;

@Controller('/recipients')
@UseGuards(JwtAuthGuard)
export class CreateRecipientController {
  constructor(private createRecipient: RegisterRecipientUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateRecipientBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { name, state, city, street, number, zipCode, latitude, longitude } =
      body;
    const userId = user.sub;

    const result = await this.createRecipient.execute({
      userId: userId,
      name,
      state,
      city,
      street,
      number,
      zipCode,
      latitude,
      longitude,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
