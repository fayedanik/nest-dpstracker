import { IMapper } from '../../domain/common/maper.interface';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionDocument } from '../schemas/transaction.schema';
import { FilterQuery } from 'mongoose';
import { DpsDocument } from '../schemas/dps.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionMapper
  implements IMapper<Transaction, TransactionDocument>
{
  toDomain(raw: TransactionDocument): Transaction {
    return {
      ...raw,
      id: raw._id.toString(),
    } as unknown as Transaction;
  }

  toPersistence(domain: Transaction): TransactionDocument {
    return {
      ...domain,
      _id: domain.id.toString(),
    } as TransactionDocument;
  }

  toPersistFilter(
    domain?: FilterQuery<Partial<Transaction>>,
  ): FilterQuery<Partial<TransactionDocument>> {
    const query: FilterQuery<Partial<TransactionDocument>> = {};
    if (domain?.id) query._id = domain.id;
    if (domain?.transactionType) {
      query.transactionType = domain.transactionType;
    }
    if (domain?.dpsId) {
      query.dpsId = domain.dpsId;
    }
    return query;
  }

  toPersistUpdate(domain: Partial<Transaction>): Partial<TransactionDocument> {
    const update: Partial<TransactionDocument> = {};
    if (domain?.status) {
      update.status = domain.status;
    }
    if (domain.lastUpdatedBy) {
      update.lastUpdatedBy = domain.lastUpdatedBy;
    }
    return update;
  }
}
