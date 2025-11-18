import { Document, FilterQuery, Model, SortOrder } from 'mongoose';
import { IRepository } from 'src/application/ports/generic-repository.interface';
import { IMapper } from '../../domain/common/maper.interface';
import { SecurityContextProvider } from '../../core/SecurityContext/security-context-provider.service';

export class GenericRepository<TDomain, TPersist extends Document>
  implements IRepository<TDomain>
{
  constructor(
    private readonly model: Model<TPersist>,
    private readonly mapper: IMapper<TDomain, TPersist>,
    protected readonly securityContextProvider: SecurityContextProvider,
  ) {}

  async insert(entity: TDomain): Promise<TDomain | null> {
    const doc = new this.model(this.mapper.toPersistence(entity));
    try {
      const saved = await doc.save();
      return this.mapper.toDomain(saved.toObject());
    } catch (err) {
      return null;
    }
  }

  async getItem(filter: FilterQuery<TDomain>): Promise<TDomain | null> {
    const doc = await this.model
      .findOne(this.mapper.toPersistFilter(filter))
      .exec();
    return doc ? this.mapper.toDomain(doc.toObject()) : null;
  }

  async getItems(
    filter?: FilterQuery<TDomain>,
    sort: { [key: string]: SortOrder } = {},
    pageIndex = 0,
    pageLimit = 100,
  ): Promise<TDomain[]> {
    const persistFilter = this.mapper.toPersistFilter(filter);
    const securityContext = this.securityContextProvider.getSecurityContext();
    persistFilter.$or = [
      { rolesAllowedToRead: { $in: securityContext.roles } },
      { idsAllowedToRead: { $in: [securityContext.userId] } },
    ];
    const doc = await this.model
      .find(persistFilter)
      .sort(sort)
      .skip(Math.max(pageIndex - 1, 0) * pageLimit)
      .limit(pageLimit)
      .exec();
    return doc.map((d) => this.mapper.toDomain(d.toObject())) ?? [];
  }

  async getCount(filter?: FilterQuery<TDomain>): Promise<number> {
    return await this.model
      .countDocuments(this.mapper.toPersistFilter(filter))
      .exec();
  }

  async update(id: string, entity: Partial<TDomain>): Promise<TDomain | null> {
    const doc = await this.model
      .findByIdAndUpdate(id, this.mapper.toPersistUpdate(entity), { new: true })
      .exec();
    return doc ? this.mapper.toDomain(doc.toObject()) : null;
  }
}
