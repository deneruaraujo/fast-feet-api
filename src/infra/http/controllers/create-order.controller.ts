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
import { CreateOrderUseCase } from '@/domain/main/application/use-cases/create-order';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';

const createOrderBodySchema = z.object({
  name: z.string(),
  isAvailableForPickup: z.boolean(),
  hasBeenPickedUp: z.boolean(),
  hasBeenDelivered: z.boolean(),
  hasBeenReturned: z.boolean(),
});

const bodyValidationPipe = new ZodValidationPipe(createOrderBodySchema);

type CreateOrderBodySchema = z.infer<typeof createOrderBodySchema>;

@Controller('/orders')
@UseGuards(JwtAuthGuard)
export class CreateOrderController {
  constructor(private createOrder: CreateOrderUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateOrderBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const {
      name,
      isAvailableForPickup,
      hasBeenPickedUp,
      hasBeenDelivered,
      hasBeenReturned,
    } = body;
    const userId = user.sub;

    const result = await this.createOrder.execute({
      userId: userId,
      name,
      isAvailableForPickup,
      hasBeenPickedUp,
      hasBeenDelivered,
      hasBeenReturned,
      attachmentsIds: [],
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
