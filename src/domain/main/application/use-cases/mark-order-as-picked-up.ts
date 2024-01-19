import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Order } from '../../enterprise/entities/order';
import { OrdersRepository } from '../repositories/orders-repository';
import { Injectable } from '@nestjs/common';

interface MarkOrderAsPickedUpUseCaseRequest {
  userId: string;
  orderId: string;
  hasBeenPickedUp: boolean;
}

type MarkOrderAsPickedUpUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order;
  }
>;
@Injectable()
export class MarkOrderAsPickedUpUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    userId,
    orderId,
    hasBeenPickedUp,
  }: MarkOrderAsPickedUpUseCaseRequest): Promise<MarkOrderAsPickedUpUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId);

    if (!order) {
      return left(new ResourceNotFoundError());
    }

    order.userId = userId;
    order.hasBeenPickedUp = hasBeenPickedUp;

    await this.ordersRepository.save(order);

    return right({
      order,
    });
  }
}
