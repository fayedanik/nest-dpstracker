import { DpsSchema } from '../../infrastructure/schemas/dps.schema';
import { IRepository } from './generic-repository.interface';
import { Dps } from '../../domain/entities/dps.entity';

export interface IDpsRepository extends IRepository<Dps> {
  addDps(dps: Dps): Promise<boolean>;
  deleteDps(id: string): Promise<boolean>;
  deleteDpsByAccountNo(accountNo: string): Promise<boolean>;
  getDpsListByUserId(userId: string): Promise<Dps[]>;
}

export const DPS_REPOSITORY = Symbol('DPS_REPOSITORY');
