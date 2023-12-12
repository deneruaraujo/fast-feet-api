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
      ...override,
    },
    id,
  );

  return recipient;
}
