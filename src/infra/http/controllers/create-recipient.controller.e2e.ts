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
  user: z.any(),
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
    @CurrentUser() currentUser: UserPayload,
  ) {
    const {
      name,
      state,
      city,
      street,
      number,
      zipCode,
      latitude,
      longitude,
      user,
    } = body;
    const userId = currentUser.sub;

    const result = await this.createRecipient.execute({
      name,
      state,
      city,
      street,
      number,
      zipCode,
      latitude,
      longitude,
      user: { ...user, id: userId },
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
