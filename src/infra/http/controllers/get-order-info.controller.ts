import { GetOrderInfoUseCase } from '@/domain/main/application/use-cases/get-order-info';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { OrderPresenter } from '../presenters/order-presenter';

@Controller('/orders/:id')
export class GetOrderInfoController {
  constructor(private getOrderInfo: GetOrderInfoUseCase) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload, @Param('id') orderId: string) {
    const userId = user.sub;

    const result = await this.getOrderInfo.execute({
      orderId,
      userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return { order: OrderPresenter.toHTTP(result.value.order) };
  }
}
