import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Order } from '../../enterprise/entities/order';
import { OrdersRepository } from '../repositories/orders-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { User } from '../../enterprise/entities/user';
import { UserRole } from '@/core/enum/user-role.enum';

interface GetOrderInfoUseCaseRequest {
  orderId: string;
  user: User;
}

type GetOrderInfoUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    order: Order;
  }
>;

export class GetOrderInfoUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    orderId,
    user,
  }: GetOrderInfoUseCaseRequest): Promise<GetOrderInfoUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId);

    if (!order) {
      return left(new ResourceNotFoundError());
    }

    if (user.role !== UserRole.Admin) {
      return left(new NotAllowedError());
    }

    return right({
      order,
    });
  }
}
