import { Either, left, right } from '@/core/either';
import { User } from '../../enterprise/entities/user';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Recipient } from '../../enterprise/entities/recipient';
import { RecipientRepository } from '../repositories/recipient-repository';
import { UserRole } from '@/core/enum/user-role.enum';

interface EditRecipientUseCaseRequest {
  recipientId: string;
  name: string;
  state: string;
  city: string;
  street: string;
  number: string;
  zipCode: string;
  user: User;
}

type EditRecipientUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    recipient: Recipient;
  }
>;

export class EditRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    recipientId,
    name,
    state,
    city,
    street,
    number,
    zipCode,
    user,
  }: EditRecipientUseCaseRequest): Promise<EditRecipientUseCaseResponse> {
    const recipient = await this.recipientRepository.findById(recipientId);

    if (!recipient) {
      return left(new ResourceNotFoundError());
    }

    if (user.role !== UserRole.Admin) {
      return left(new NotAllowedError());
    }

    recipient.name = name;
    recipient.state = state;
    recipient.city = city;
    recipient.street = street;
    recipient.number = number;
    recipient.zipCode = zipCode;

    await this.recipientRepository.save(recipient);

    return right({
      recipient,
    });
  }
}
