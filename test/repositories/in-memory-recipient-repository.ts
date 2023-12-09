import { RecipientRepository } from '@/domain/main/application/repositories/recipient-repository';
import { Recipient } from '@/domain/main/enterprise/entities/recipient';

export class InMemoryRecipientRepository implements RecipientRepository {
  public items: Recipient[] = [];
  async create(recipient: Recipient) {
    this.items.push(recipient);
  }
}
