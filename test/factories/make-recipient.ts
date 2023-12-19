import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  Recipient,
  RecipientProps,
} from '@/domain/main/enterprise/entities/recipient';
import { faker } from '@faker-js/faker';

export function makeRecipient(
  override: Partial<RecipientProps> = {},
  id?: UniqueEntityId,
) {
  const recipient = Recipient.create(
    {
      name: faker.person.fullName(),
      state: faker.location.state(),
      city: faker.location.city(),
      street: faker.location.street(),
      number: faker.location.buildingNumber(),
      zipCode: faker.location.zipCode(),
      latitude: 35.8709495,
      longitude: 137.9809247,
      ...override,
    },
    id,
  );

  return recipient;
}
