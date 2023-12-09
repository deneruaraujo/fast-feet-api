import { Either, right } from '@/core/either';
import { Recipient } from '../../enterprise/entities/recipient';
import { RecipientRepository } from '../repositories/recipient-repository';

interface RegisterRecipientUseCaseRequest {
  name: string;
  state: string;
  city: string;
  street: string;
  number: string;
  zipCode: string;
}

type RegisterRecipientUseCaseResponse = Either<
  null,
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
  }: RegisterRecipientUseCaseRequest): Promise<RegisterRecipientUseCaseResponse> {
    const recipient = Recipient.create({
      name,
      state,
      city,
      street,
      number,
      zipCode,
    });

    await this.recipientRepository.create(recipient);

    return right({
      recipient,
    });
  }
}
