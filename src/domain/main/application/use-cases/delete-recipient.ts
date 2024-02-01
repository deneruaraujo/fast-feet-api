import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { RecipientsRepository } from '../repositories/recipients-repository';
import { Either, left, right } from '@/core/either';
import { UserRole } from '@/core/enum/user-role.enum';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users-repository';

interface DeleteRecipientUseCaseRequest {
  userId: string;
  recipientId: string;
}

type DeleteRecipientUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  Record<string, never>
>;
@Injectable()
export class DeleteRecipientUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    recipientId,
  }: DeleteRecipientUseCaseRequest): Promise<DeleteRecipientUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId);
    const user = await this.usersRepository.findById(userId);

    if (!recipient) {
      return left(new ResourceNotFoundError());
    }

    if (user.role !== UserRole.Admin) {
      return left(new NotAllowedError());
    }

    await this.recipientsRepository.delete(recipient);

    return right({});
  }
}
