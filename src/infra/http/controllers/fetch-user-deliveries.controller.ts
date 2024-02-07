import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { Controller, Get, Query } from '@nestjs/common';
import { FetchUserDeliveriesUseCase } from '@/domain/main/application/use-cases/fetch-user-deliveries';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { OrderPresenter } from '../presenters/order-presenter';

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('/users')
export class FetchUserDeliveriesController {
  constructor(private fetchUserDelevieries: FetchUserDeliveriesUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
  ) {
    const userId = user.sub;

    const result = await this.fetchUserDelevieries.execute({
      page,
      userId,
    });

    const orders = result.value.orders;

    return { orders: orders.map(OrderPresenter.toHTTP) };
  }
}
