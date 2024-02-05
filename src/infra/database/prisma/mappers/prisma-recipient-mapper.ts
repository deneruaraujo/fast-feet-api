import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Recipient } from '@/domain/main/enterprise/entities/recipient';
import { Prisma, Recipient as PrismaRecipient } from '@prisma/client';

export class PrismaRecipientMapper {
  static toDomain(raw: PrismaRecipient): Recipient {
    return Recipient.create(
      {
        userId: new UniqueEntityId(raw.userId).toString(),
        name: raw.name,
        state: raw.state,
        city: raw.city,
        street: raw.street,
        number: raw.number,
        zipCode: raw.zipCode,
        latitude: raw.latitude.toNumber(),
        longitude: raw.longitude.toNumber(),
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrisma(recipient: Recipient): Prisma.RecipientUncheckedCreateInput {
    return {
      id: recipient.id.toString(),
      userId: recipient.userId.toString(),
      name: recipient.name,
      state: recipient.state,
      city: recipient.city,
      street: recipient.street,
      number: recipient.number,
      zipCode: recipient.zipCode,
      latitude: recipient.latitude,
      longitude: recipient.longitude,
    };
  }
}
