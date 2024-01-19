import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Order } from '../../enterprise/entities/order';
import { OrdersRepository } from '../repositories/orders-repository';
import { Injectable } from '@nestjs/common';

interface MarkOrderAsReturnedUseCaseRequest {
  userId: string;
  orderId: string;
  hasBeenReturned: boolean;
}

type MarkOrderAsReturnedUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    order: Order;
  }
>;
@Injectable()
export class MarkOrderAsReturnedUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    userId,
    orderId,
    hasBeenReturned,
  }: MarkOrderAsReturnedUseCaseRequest): Promise<MarkOrderAsReturnedUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId);

    if (!order) {
      return left(new ResourceNotFoundError());
    }

    if (userId !== order.userId.toString()) {
      return left(new NotAllowedError());
    }

    order.userId = userId;
    order.hasBeenReturned = hasBeenReturned;

    await this.ordersRepository.save(order);

    return right({
      order,
    });
  }
}
