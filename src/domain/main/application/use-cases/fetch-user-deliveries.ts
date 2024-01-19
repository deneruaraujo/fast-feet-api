import { Either, right } from '@/core/either';
import { Order } from '../../enterprise/entities/order';
import { OrdersRepository } from '../repositories/orders-repository';
import { Injectable } from '@nestjs/common';

interface FetchUserDeliveriesUseCaseRequest {
  userId: string;
  page: number;
}

type FetchUserDeliveriesUseCaseResponse = Either<
  null,
  {
    orders: Order[];
  }
>;
@Injectable()
export class FetchUserDeliveriesUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserDeliveriesUseCaseRequest): Promise<FetchUserDeliveriesUseCaseResponse> {
    const orders = await this.ordersRepository.findManyByUserId(userId, {
      page,
    });

    return right({
      orders,
    });
  }
}
