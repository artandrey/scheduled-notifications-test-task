import { Injectable } from '@nestjs/common';
import { QueryBus as CqrsQueryBus } from '@nestjs/cqrs';

import { QueryBus } from 'src/shared/application/boundaries/query-bus';
import { Query } from 'src/shared/application/query';

@Injectable()
export class NestCqrsQueryBus extends QueryBus {
  constructor(private readonly _queryBus: CqrsQueryBus) {
    super();
  }

  execute<TResult>(query: Query<TResult>): Promise<TResult> {
    return this._queryBus.execute(query);
  }
}
