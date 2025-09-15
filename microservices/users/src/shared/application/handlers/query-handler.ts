import { Query } from '../query';

export abstract class QueryHandler<TQuery extends Query<TResult>, TResult = unknown> {
  execute(query: TQuery): Promise<TResult> {
    return this.implementation(query);
  }

  abstract implementation(payload: TQuery): Promise<TResult>;
}
