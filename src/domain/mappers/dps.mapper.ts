import { Injectable } from '@nestjs/common';
import { Dps } from '../entities/dps.entity';
import { DpsResponseDto } from '../../presentation/dtos/response-dtos/dps-response.dto';

@Injectable()
export class DpsMapper {
  public static toDto(
    dps: Dps,
    loggedInUserId: string,
    isAdmin: boolean,
  ): DpsResponseDto {
    return {
      id: dps.id,
      dpsName: dps.dpsName,
      accountNo: dps.accountNumber,
      monthlyAmount: dps.monthlyDeposit,
      durationMonths: dps.durationMonths,
      startDate: dps.startDate,
      maturityDate: dps.maturityDate,
      interestRate: dps.interestRate,
      dpsOwners: dps.dpsOwners,
      canUpdate: dps.idsAllowedToUpdate?.includes(loggedInUserId) ?? isAdmin,
      canDelete: dps.idsAllowedToDelete?.includes(loggedInUserId) ?? isAdmin,
    };
  }
}
