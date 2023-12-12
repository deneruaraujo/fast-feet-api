import { Either, left, right } from '@/core/either';
import { Recipient } from '../../enterprise/entities/recipient';
import { RecipientRepository } from '../repositories/recipient-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { User } from '../../enterprise/entities/user';
import { UserRole } from '@/core/enum/user-role.enum';

interface RegisterRecipientUseCaseRequest {
  name: string;
  state: string;
  city: string;
  street: string;
  number: string;
  zipCode: string;
  user: User;
}

type RegisterRecipientUseCaseResponse = Either<
  NotAllowedError,
  {
    recipient: Recipient;
  }
>;

export class RegisterRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    name,
    state,
    city,
    street,
    number,
    zipCode,
    user,
  }: RegisterRecipientUseCaseRequest): Promise<RegisterRecipientUseCaseResponse> {
    const recipient = Recipient.create({
      name,
      state,
      city,
      street,
      number,
      zipCode,
    });

    if (user.role !== UserRole.Admin) {
      return left(new NotAllowedError());
    }

    await this.recipientRepository.create(recipient);

    return right({
      recipient,
    });
  }
}
