import { Injectable } from '@nestjs/common';
import { Dps } from '../entities/dps.entity';
import { DpsResponseDto } from '../../presentation/dtos/response-dtos/dps-response.dto';

@Injectable()
export class DpsMapper {
  public static toDto(dps: Dps): DpsResponseDto {
    return {
      id: dps.id,
      accountNo: dps.accountNumber,
      monthlyAmount: dps.monthlyDeposit,
      durationMonths: dps.durationMonths,
      startDate: dps.startDate,
      maturityDate: dps.maturityDate,
      interestRate: dps.interestRate,
      dpsOwners: dps.dpsOwners,
    };
  }
}
