import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Recipient } from '../../enterprise/entities/recipient';
import { RecipientsRepository } from '../repositories/recipients-repository';
import { UserRole } from '@/core/enum/user-role.enum';
import { User } from '../../enterprise/entities/user';
import { Injectable } from '@nestjs/common';

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
@Injectable()
export class GetRecipientInfoUseCase {
  constructor(private recipientRepository: RecipientsRepository) {}

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
