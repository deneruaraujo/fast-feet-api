import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { User } from '../../enterprise/entities/user';
import { UsersRepository } from '../repositories/users-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { UserRole } from '@/core/enum/user-role.enum';
import { Injectable } from '@nestjs/common';

interface GetUserInfoUseCaseRequest {
  userId: string;
}

type GetUserInfoUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    user: User;
  }
>;
@Injectable()
export class GetUserInfoUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserInfoUseCaseRequest): Promise<GetUserInfoUseCaseResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    if (user.role !== UserRole.Admin) {
      return left(new NotAllowedError());
    }

    return right({
      user,
    });
  }
}
