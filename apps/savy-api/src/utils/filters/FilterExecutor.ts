import { FilterFactory } from "./FilterFactory";

export default class FilterExecutor {
  static executeFilter<TData>(filterName: string, data: TData[]): TData[] {
    const filter = FilterFactory.createFilter<TData>(filterName);
    return filter.apply(data);
  }
}
