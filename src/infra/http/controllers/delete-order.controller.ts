import { DeleteOrderUseCase } from '@/domain/main/application/use-cases/delete-order';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common';

@Controller('/orders/:id')
export class DeleteOrderController {
  constructor(private deleteOrder: DeleteOrderUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@CurrentUser() user: UserPayload, @Param('id') orderId: string) {
    const userId = user.sub;

    const result = await this.deleteOrder.execute({
      orderId,
      userId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
