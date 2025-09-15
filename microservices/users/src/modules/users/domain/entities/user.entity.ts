import { Entity, Nominal } from 'src/shared/domain/entity';

export type UserId = Nominal<string, 'UserId'>;

export class User extends Entity<UserId> {
  private readonly _name: string;

  constructor(name: string, id?: UserId) {
    super(id);
    this._name = name;
  }

  get name(): string {
    return this._name;
  }
}
