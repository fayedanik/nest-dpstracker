import { FilterQuery, SortOrder } from 'mongoose';
import { BaseQuery } from '../queries/base.query';

export interface IRepository<T> {
  insert(entity: T): Promise<T | null>;
  getItem(filter: FilterQuery<T>): Promise<T | null>;
  getItems(
    filter?: FilterQuery<T>,
    sort?: { [key: string]: SortOrder },
    pageIndex?: number,
    pageLimit?: number,
  ): Promise<T[]>;
  getCount(filter?: FilterQuery<T>): Promise<number>;
  update(id: string, entity: Partial<T>): Promise<T | null>;
}
