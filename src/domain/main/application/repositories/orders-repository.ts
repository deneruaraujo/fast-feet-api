import { PaginationParams } from '@/core/repositories/pagination-params';
import { Order } from '../../enterprise/entities/order';

export interface FindManyNearbyParams {
  latitude: number;
  longitude: number;
}

export abstract class OrdersRepository {
  abstract create(order: Order): Promise<void>;
  abstract save(order: Order): Promise<void>;
  abstract delete(order: Order): Promise<void>;
  abstract findById(id: string): Promise<Order | null>;
  abstract findManyNearby(
    params: FindManyNearbyParams,

    paginationParams: PaginationParams,
  ): Promise<Order[] | null>;
  abstract findManyByUserId(
    userId: string,
    paginationParams: PaginationParams,
  ): Promise<Order[] | null>;
}
