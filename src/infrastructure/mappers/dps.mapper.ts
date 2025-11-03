import { IMapper } from '../../domain/common/maper.interface';
import { Dps } from '../../domain/entities/dps.entity';
import { FilterQuery } from 'mongoose';
import { DpsDocument } from '../schemas/dps.schema';

export class DpsMapper implements IMapper<Dps, DpsDocument> {
  toDomain(raw: DpsDocument): Dps {
    return {
      ...raw,
      id: raw._id.toString(),
    };
  }

  toPersistence(domain: Dps): DpsDocument {
    return {
      _id: domain.id,
      ...domain,
    } as DpsDocument;
  }

  toPersistFilter(
    domain?: FilterQuery<Partial<Dps>>,
  ): FilterQuery<Partial<DpsDocument>> {
    const filter: FilterQuery<Partial<DpsDocument>> = {};
    if (!domain) return filter;

    return filter;
    //return undefined;
  }

  toPersistUpdate(domain: Partial<Dps>): Partial<DpsDocument> {
    const update: Partial<DpsDocument> = {};
    return update;
  }
}
