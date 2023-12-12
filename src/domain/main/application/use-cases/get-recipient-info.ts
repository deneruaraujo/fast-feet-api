import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Recipient } from '../../enterprise/entities/recipient';
import { RecipientRepository } from '../repositories/recipient-repository';
import { UserRole } from '@/core/enum/user-role.enum';
import { User } from '../../enterprise/entities/user';

interface GetRecipientInfoUseCaseRequest {
  user: User;
  recipientId: string;
}

type GetRecipientInfoUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    recipient: Recipient;
  }
>;

export class GetRecipientInfoUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    recipientId,
    user,
  }: GetRecipientInfoUseCaseRequest): Promise<GetRecipientInfoUseCaseResponse> {
    const recipient = await this.recipientRepository.findById(recipientId);

    if (!recipient) {
      return left(new ResourceNotFoundError());
    }

    if (user.role !== UserRole.Admin) {
      return left(new NotAllowedError());
    }

    return right({
      recipient,
    });
  }
}
