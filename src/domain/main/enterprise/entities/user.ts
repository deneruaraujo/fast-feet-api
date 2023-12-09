import { UserRole } from 'src/core/enum/user-role.enum';
import { Entity } from 'src/core/entities/entity';
import { UniqueEntityId } from 'src/core/entities/unique-entity-id';

export interface UserProps {
  name: string;
  ssn: string;
  password: string;
  role: UserRole;
}

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get ssn() {
    return this.props.ssn;
  }

  set ssn(ssn: string) {
    this.props.ssn = ssn;
  }

  get password() {
    return this.props.password;
  }

  set password(password: string) {
    this.props.password = password;
  }

  get role() {
    return this.props.role;
  }

  set role(role: UserRole) {
    this.props.role = role;
  }

  static create(props: UserProps, id?: UniqueEntityId) {
    const user = new User(props, id);

    return user;
  }
}
