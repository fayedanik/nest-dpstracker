import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateDpsCommand } from '../../../commands/dps/update-dps.command';
import { SecurityContextProvider } from '../../../../core/SecurityContext/security-context-provider.service';
import { Inject } from '@nestjs/common';
import {
  DPS_REPOSITORY,
  type IDpsRepository,
} from '../../../ports/dps.interface';
import { CommandResponse } from '../../../../shared/generic-class/command-response.class';
import { ErrorMessageConst } from '../../../../shared/consts/error.const';

@CommandHandler(UpdateDpsCommand)
export class UpdateDpsCommandHandler
  implements ICommandHandler<UpdateDpsCommand, CommandResponse<boolean>>
{
  constructor(
    private readonly securityContextProvider: SecurityContextProvider,
    @Inject(DPS_REPOSITORY)
    private readonly dpsRepository: IDpsRepository,
  ) {}
  async execute(command: UpdateDpsCommand): Promise<any> {
    try {
      const securityContext = this.securityContextProvider.getSecurityContext();
      const dps = await this.dpsRepository.getItem({ id: command.dpsId });
      if (!dps) {
        return CommandResponse.failure(ErrorMessageConst.CONTENT_NOT_FOUND);
      }
      if (
        dps.startDate > command.paymentDate ||
        dps.maturityDate < command.paymentDate
      ) {
        return CommandResponse.failure(ErrorMessageConst.INAVLID_DPS);
      }
      let canUpdate: boolean = (dps.idsAllowedToUpdate || []).includes(
        securityContext.userId,
      );
      securityContext.roles.forEach((role) => {
        if ((dps.rolesAllowedToUpdate || []).includes(role)) {
          canUpdate = true;
        }
      });
      if (!canUpdate) {
        return CommandResponse.failure(ErrorMessageConst.FORBIDDEN);
      }
      const dpsOwner = dps.dpsOwners.find((x) => x.userId == command.ownerId);
      if (!dpsOwner) {
        return CommandResponse.failure(ErrorMessageConst.INVALID_DPS_OWNER);
      }
      const year = new Date(command.paymentDate).getFullYear();
      const month = new Date(command.paymentDate).getMonth();
      const isAlreadyPaymentDateFound = (dpsOwner.installmentDates || []).some(
        (p) => p.getFullYear() === year && p.getMonth() === month,
      );
      if (isAlreadyPaymentDateFound) {
        return CommandResponse.failure(ErrorMessageConst.INVALID_PAYMENT_DATE);
      }
      dpsOwner.installmentDates = dpsOwner.installmentDates ?? [];
      dpsOwner.amountPaid = dpsOwner.amountPaid ?? 0;
      dpsOwner.installmentDates.push(command.paymentDate);
      dpsOwner.amountPaid += Math.ceil(
        dps.monthlyDeposit / (dps.dpsOwners.length ?? 1),
      );
      const index = dps.dpsOwners.findIndex((x) => x.userId == command.ownerId);
      dps.dpsOwners[index] = dpsOwner;
      const result = await this.dpsRepository.update(dps.id, dps);
      return result
        ? CommandResponse.success()
        : CommandResponse.failure(ErrorMessageConst.SOMETHING_WENT_WRONT);
    } catch (e) {
      return CommandResponse.failure();
    }
  }
}
