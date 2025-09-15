import { Query } from '../query';

export abstract class QueryBus {
  abstract execute<TResult>(query: Query<TResult>): Promise<TResult>;
}
