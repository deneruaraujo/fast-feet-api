import { PaginationParams } from '@/core/repositories/pagination-params';
import { Order } from '../../enterprise/entities/order';

export interface FindManyNearbyParams {
  latitude: number;
  longitude: number;
}

export interface OrdersRepository {
  create(order: Order): Promise<void>;
  save(order: Order): Promise<void>;
  delete(order: Order): Promise<void>;
  findById(id: string): Promise<Order | null>;
  findManyNearby(
    params: FindManyNearbyParams,
    paginationParams: PaginationParams,
  ): Promise<Order[] | null>;
}
