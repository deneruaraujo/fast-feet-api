import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Order, OrderProps } from '@/domain/main/enterprise/entities/order';
import { faker } from '@faker-js/faker';

export function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityId,
) {
  const order = Order.create(
    {
      userId: new UniqueEntityId().toString(),
      name: faker.person.fullName(),
      isAvailableForPickup: false,
      hasBeenPickedUp: false,
      hasBeenDelivered: false,
      hasBeenReturned: false,
      ...override,
    },
    id,
  );

  return order;
}
