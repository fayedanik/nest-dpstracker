import { IMapper } from '../../domain/common/maper.interface';
import { Dps } from '../../domain/entities/dps.entity';
import { FilterQuery } from 'mongoose';
import { DpsDocument } from '../schemas/dps.schema';

export class DpsMapper implements IMapper<Dps, DpsDocument> {
  toDomain(raw: DpsDocument): Dps {
    return {
      ...raw,
      id: raw._id.toString(),
      dpsOwners: raw.dpsOwners ?? [],
    } as unknown as Dps;
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
    if (domain.id) filter._id = domain.id;
    return filter;
    //return undefined;
  }

  toPersistUpdate(domain: Partial<Dps>): Partial<DpsDocument> {
    const update: Partial<DpsDocument> = {};
    if (domain.totalDeposit) update.totalDeposit = domain.totalDeposit;
    if (domain.installmentDates)
      update.installmentDates = domain.installmentDates;
    if (domain.lastUpdatedBy) {
      update.lastUpdatedBy = domain.lastUpdatedBy;
    }
    if (domain.dpsOwners) {
      update.dpsOwners = domain.dpsOwners;
    }
    console.log(update);
    return update;
  }
}
