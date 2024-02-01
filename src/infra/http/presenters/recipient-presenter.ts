import { Recipient } from '@/domain/main/enterprise/entities/recipient';

export class RecipientPresenter {
  static toHTTP(recipient: Recipient) {
    return {
      id: recipient.id.toString(),
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
