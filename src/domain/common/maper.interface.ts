import { FilterQuery } from 'mongoose';

export interface IMapper<TDomain, TDocument> {
  toDomain(raw: TDocument): TDomain;
  toPersistence(domain: TDomain): TDocument;
  toPersistFilter(
    domain?: FilterQuery<Partial<TDomain>>,
  ): FilterQuery<Partial<TDocument>>;
  toPersistUpdate(domain: Partial<TDomain>): Partial<TDocument>;
}
