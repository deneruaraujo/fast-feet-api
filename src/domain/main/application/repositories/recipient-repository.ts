import { Recipient } from '../../enterprise/entities/recipient';

export abstract class RecipientRepository {
  abstract create(recipient: Recipient): Promise<void>;
}
