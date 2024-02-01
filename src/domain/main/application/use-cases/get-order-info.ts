import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Order } from '../../enterprise/entities/order';
import { OrdersRepository } from '../repositories/orders-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { UserRole } from '@/core/enum/user-role.enum';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users-repository';

interface GetOrderInfoUseCaseRequest {
  userId: string;
  orderId: string;
}

type GetOrderInfoUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    order: Order;
  }
>;
@Injectable()
export class GetOrderInfoUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    orderId,
  }: GetOrderInfoUseCaseRequest): Promise<GetOrderInfoUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId);
    const user = await this.usersRepository.findById(userId);

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
