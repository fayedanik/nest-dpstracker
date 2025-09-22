import { FilterQuery } from 'mongoose';

export interface IRepository<T> {
  insert(entity: T): Promise<T>;
  getItem(filter: FilterQuery<T>): Promise<T | null>;
  getItems(filter: FilterQuery<T>): Promise<T[]>;
  update(id: string, entity: Partial<T>): Promise<T | null>;
}
