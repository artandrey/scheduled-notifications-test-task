export const RESULT_TYPE = Symbol('QUERY_RESULT_TYPE');

export abstract class Query<TResult = unknown> {
  readonly [RESULT_TYPE]: TResult;
}
