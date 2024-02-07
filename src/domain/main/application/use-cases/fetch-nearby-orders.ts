import { Either, left, right } from '@/core/either';
import { Order } from '../../enterprise/entities/order';
import { OrdersRepository } from '../repositories/orders-repository';
import { Injectable } from '@nestjs/common';

interface FetchNearbyOrdersUseCaseRequest {
  userId: string;
  userLatitude: number;
  userLongitude: number;
  page: number;
}

type FetchNearbyOrdersUseCaseResponse = Either<
  null,
  {
    orders: Order[];
  }
>;
@Injectable()
export class FetchNearbyOrdersUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    userId,
    userLatitude,
    userLongitude,
    page,
  }: FetchNearbyOrdersUseCaseRequest): Promise<FetchNearbyOrdersUseCaseResponse> {
    const orders = await this.ordersRepository.findManyNearby(
      {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      { page },
    );

    if (userId !== orders.find((item) => item.userId).userId) {
      return left(null);
    }

    return right({ orders });
  }
}
