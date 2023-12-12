import { RecipientRepository } from '@/domain/main/application/repositories/recipient-repository';
import { Recipient } from '@/domain/main/enterprise/entities/recipient';

export class InMemoryRecipientRepository implements RecipientRepository {
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
}
