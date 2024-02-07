import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { Controller, Get, Query } from '@nestjs/common';
import { FetchNearbyOrdersUseCase } from '@/domain/main/application/use-cases/fetch-nearby-orders';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { OrderPresenter } from '../presenters/order-presenter';

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

const nearbyOrdersQuerySchema = z.object({
  latitude: z.coerce.number().refine((value) => {
    return Math.abs(value) <= 90;
  }),
  longitude: z.coerce.number().refine((value) => {
    return Math.abs(value) <= 180;
  }),
});

interface NearbyOrdersQuery {
  latitude: number;
  longitude: number;
}

@Controller('/orders')
export class FetchNearbyOrdersController {
  constructor(private fetchNearbyOrders: FetchNearbyOrdersUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Query() query: NearbyOrdersQuery,
  ) {
    const { latitude, longitude } = nearbyOrdersQuerySchema.parse(query);

    const userId = user.sub;

    const result = await this.fetchNearbyOrders.execute({
      userId: userId,
      userLatitude: latitude,
      userLongitude: longitude,
      page,
    });

    const orders = result.value.orders;

    return { orders: orders.map(OrderPresenter.toHTTP) };
  }
}
