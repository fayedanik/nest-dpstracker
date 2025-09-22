import { Document, FilterQuery, Model } from 'mongoose';
import { IRepository } from 'src/application/ports/generic-repository.interface';
import { IMapper } from '../../domain/common/maper.interface';

export class MongoBaseRepository<TDomain, TPersist extends Document>
  implements IRepository<TDomain>
{
  constructor(
    private readonly model: Model<TPersist>,
    private readonly mapper: IMapper<TDomain, TPersist>,
  ) {}

  async insert(entity: TDomain): Promise<TDomain> {
    const doc = new this.model(this.mapper.toPersistence(entity));
    const saved = await doc.save();
    return this.mapper.toDomain(saved.toObject());
  }

  async getItem(filter: FilterQuery<TDomain>): Promise<TDomain | null> {
    const doc = await this.model
      .findOne(this.mapper.toPersistFilter(filter))
      .exec();
    return doc ? this.mapper.toDomain(doc.toObject()) : null;
  }

  async getItems(filter: FilterQuery<TDomain>): Promise<TDomain[]> {
    const doc = await this.model
      .find(this.mapper.toPersistFilter(filter))
      .exec();
    return doc.map((d) => this.mapper.toDomain(d.toObject())) ?? [];
  }

  async update(id: string, entity: Partial<TDomain>): Promise<TDomain | null> {
    const doc = await this.model
      .findByIdAndUpdate(id, this.mapper.toPersistUpdate(entity), { new: true })
      .exec();
    return doc ? this.mapper.toDomain(doc.toObject()) : null;
  }
}
