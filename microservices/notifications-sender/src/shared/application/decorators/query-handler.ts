import { QueryHandler as CqrsQueryHandler } from '@nestjs/cqrs';

import { Query } from '../query';

export const QueryHandlerInjectable = (query: new (...args: any[]) => Query) => CqrsQueryHandler(query);
