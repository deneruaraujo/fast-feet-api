import { Either, left, right } from '@/core/either';
import { Recipient } from '../../enterprise/entities/recipient';
import { RecipientsRepository } from '../repositories/recipients-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { UserRole } from '@/core/enum/user-role.enum';
import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { UsersRepository } from '../repositories/users-repository';

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
}

type RegisterRecipientUseCaseResponse = Either<
  NotAllowedError,
  {
    recipient: Recipient;
  }
>;
@Injectable()
export class RegisterRecipientUseCase {
  constructor(
    private recipientRepository: RecipientsRepository,
    private usersRepository: UsersRepository,
  ) {}

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
  }: RegisterRecipientUseCaseRequest): Promise<RegisterRecipientUseCaseResponse> {
    const recipient = Recipient.create({
      userId: new UniqueEntityId(userId).toString(),
      name,
      state,
      city,
      street,
      number,
      zipCode,
      latitude,
      longitude,
    });

    const user = await this.usersRepository.findById(userId);

    if (user.role !== UserRole.Admin) {
      return left(new NotAllowedError());
    }

    await this.recipientRepository.create(recipient);

    return right({
      recipient,
    });
  }
}
