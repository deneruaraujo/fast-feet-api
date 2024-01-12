import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Order, OrderProps } from '@/domain/main/enterprise/entities/order';

export function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityId,
) {
  const order = Order.create(
    {
      userId: new UniqueEntityId().toString(),
      name: 'name',
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
