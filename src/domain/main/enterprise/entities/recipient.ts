import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface RecipientProps {
  name: string;
  state: string;
  city: string;
  street: string;
  number: string;
  zipCode: string;
}

export class Recipient extends Entity<RecipientProps> {
  get name() {
    return this.props.name;
  }

  get state() {
    return this.props.state;
  }

  get city() {
    return this.props.city;
  }

  get street() {
    return this.props.street;
  }

  get number() {
    return this.props.number;
  }

  get zipCode() {
    return this.props.zipCode;
  }

  static create(props: RecipientProps, id?: UniqueEntityId) {
    const recipient = new Recipient(props, id);

    return recipient;
  }
}
