export type LogArguments = {
  stringifiable: Array<string | number | boolean>;
  objectifiable: Array<object | null>;
  errorifiable: Array<Error | null>;
};
