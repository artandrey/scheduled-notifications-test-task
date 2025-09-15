export const RESULT_TYP = Symbol('COMMAND_RESULT_TYPE');

export abstract class Command<TResult = unknown> {
  readonly [RESULT_TYP]: TResult;
}
