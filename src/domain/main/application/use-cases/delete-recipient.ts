import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { RecipientsRepository } from '../repositories/recipients-repository';
import { Either, left, right } from '@/core/either';
import { UserRole } from '@/core/enum/user-role.enum';
import { User } from '../../enterprise/entities/user';

interface DeleteRecipientUseCaseRequest {
  recipientId: string;
  user: User;
}

type DeleteRecipientUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  Record<string, never>
>;

export class DeleteRecipientUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    recipientId,
    user,
  }: DeleteRecipientUseCaseRequest): Promise<DeleteRecipientUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId);

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
