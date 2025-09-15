export type Nominal<T, N> = T & { __nominal__: N };

export abstract class Entity<T> {
  protected readonly _id!: T;

  constructor(id?: T) {
    if (id) {
      this._id = id;
    }
  }

  get id(): T {
    return this._id;
  }
}
