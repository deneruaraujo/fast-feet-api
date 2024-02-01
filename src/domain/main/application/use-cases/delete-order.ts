import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { OrdersRepository } from '../repositories/orders-repository';
import { UserRole } from '@/core/enum/user-role.enum';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users-repository';

interface DeleteOrderUseCaseRequest {
  userId: string;
  orderId: string;
}

type DeleteOrderUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  Record<string, never>
>;
@Injectable()
export class DeleteOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    orderId,
  }: DeleteOrderUseCaseRequest): Promise<DeleteOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId);
    const user = await this.usersRepository.findById(userId);

    if (!order) {
      return left(new ResourceNotFoundError());
    }

    if (user.role !== UserRole.Admin) {
      return left(new NotAllowedError());
    }

    await this.ordersRepository.delete(order);

    return right({});
  }
}
