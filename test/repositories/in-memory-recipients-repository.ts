import { RecipientsRepository } from '@/domain/main/application/repositories/recipients-repository';
import { Recipient } from '@/domain/main/enterprise/entities/recipient';

export class InMemoryRecipientsRepository implements RecipientsRepository {
  public items: Recipient[] = [];
  async create(recipient: Recipient) {
    this.items.push(recipient);
  }

  async findById(id: string) {
    const recipient = this.items.find((item) => item.id.toString() === id);

    if (!recipient) {
      return null;
    }

    return recipient;
  }

  async save(recipient: Recipient) {
    const itemIndex = this.items.findIndex((item) => item.id === recipient.id);

    this.items[itemIndex] = recipient;
  }

  async delete(recipient: Recipient) {
    const itemIndex = this.items.findIndex((item) => item.id === recipient.id);

    this.items.splice(itemIndex, 1);
  }
}
