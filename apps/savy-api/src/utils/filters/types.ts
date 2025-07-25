export type Operator = "=" | ">" | "<" | ">=" | "<=" | "!=";

export interface Filter<TData> {
  name: string;
  apply(data: TData[]): TData[];
}
