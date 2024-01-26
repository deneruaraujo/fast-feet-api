import { Either, left, right } from '@/core/either';
import { Recipient } from '../../enterprise/entities/recipient';
import { RecipientsRepository } from '../repositories/recipients-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { User } from '../../enterprise/entities/user';
import { UserRole } from '@/core/enum/user-role.enum';
import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

interface RegisterRecipientUseCaseRequest {
  userId: string;
  name: string;
  state: string;
  city: string;
  street: string;
  number: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  user: User;
}

type RegisterRecipientUseCaseResponse = Either<
  NotAllowedError,
  {
    recipient: Recipient;
  }
>;
@Injectable()
export class RegisterRecipientUseCase {
  constructor(private recipientRepository: RecipientsRepository) {}

  async execute({
    userId,
    name,
    state,
    city,
    street,
    number,
    zipCode,
    latitude,
    longitude,
    user,
  }: RegisterRecipientUseCaseRequest): Promise<RegisterRecipientUseCaseResponse> {
    const recipient = Recipient.create({
      userId: new UniqueEntityId(userId),
      name,
      state,
      city,
      street,
      number,
      zipCode,
      latitude,
      longitude,
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
