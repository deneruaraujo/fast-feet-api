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
import { EditOrderUseCase } from '@/domain/main/application/use-cases/edit-order';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';

const editOrderBodySchema = z.object({
  name: z.string(),
  isAvailableForPickup: z.boolean(),
  hasBeenPickedUp: z.boolean(),
  hasBeenDelivered: z.boolean(),
  hasBeenReturned: z.boolean(),
});

const bodyValidationPipe = new ZodValidationPipe(editOrderBodySchema);

type EditOrderBodySchema = z.infer<typeof editOrderBodySchema>;

@Controller('/orders/:id')
export class EditOrderController {
  constructor(private editOrder: EditOrderUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditOrderBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id') orderId: string,
  ) {
    const {
      name,
      isAvailableForPickup,
      hasBeenPickedUp,
      hasBeenDelivered,
      hasBeenReturned,
    } = body;
    const userId = user.sub;

    const result = await this.editOrder.execute({
      userId: userId,
      orderId,
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
