import { IDpsRepository } from '../../application/ports/dps.interface';
import { GenericRepository } from './generic.repository';
import { Dps } from '../../domain/entities/dps.entity';

import { Model, Promise } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DpsDocument } from '../schemas/dps.schema';
import { DpsMapper } from '../mappers/dps.mapper';

@Injectable()
export class DpsRepository
  extends GenericRepository<Dps, DpsDocument>
  implements IDpsRepository
{
  constructor(
    @InjectModel(DpsDocument.name)
    private readonly dpsModel: Model<DpsDocument>,
    private readonly dpsMapper: DpsMapper,
  ) {
    super(dpsModel, dpsMapper);
  }

  async addDps(dps: Dps): Promise<boolean> {
    try {
      const res = await this.insert({ ...dps });
      return true;
    } catch (err) {
      return false;
    }
  }

  async deleteDps(id: string): Promise<boolean> {
    try {
      const response = await this.dpsModel.deleteOne({ _id: id }).exec();
      return response?.deletedCount == 1;
    } catch (error) {
      return false;
    }
  }

  async getDpsListByUserId(userId: string): Promise<Dps[]> {
    try {
      const response = await this.dpsModel
        .find({ 'dpsOwners.userId': userId })
        .exec();
      return response.map((dps) => this.dpsMapper.toDomain(dps.toObject()));
    } catch (err) {
      console.log(err);
      return [];
    }
  }
}
