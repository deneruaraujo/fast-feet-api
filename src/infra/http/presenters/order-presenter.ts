import { Order } from '@/domain/main/enterprise/entities/order';

export class OrderPresenter {
  static toHTTP(order: Order) {
    return {
      id: order.id,
      userId: order.userId,
      name: order.name,
      isAvailableForPickup: order.isAvailableForPickup,
      hasBeenPickedUp: order.hasBeenPickedUp,
      hasBeenDelivered: order.hasBeenDelivered,
      hasBeenReturned: order.hasBeenReturned,
    };
  }
}
