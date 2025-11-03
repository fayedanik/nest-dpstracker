import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteDpsCommand } from '../../../commands/dps/delete-dps.command';
import { CommandResponse } from '../../../../shared/generic-class/command-response.class';
import { SecurityContextProvider } from '../../../../core/SecurityContext/security-context-provider.service';
import { Inject } from '@nestjs/common';
import {
  DPS_REPOSITORY,
  type IDpsRepository,
} from '../../../ports/dps.interface';
import { ErrorMessageConst } from '../../../../shared/consts/error.const';

@CommandHandler(DeleteDpsCommand)
export class DeleteDpsCommandHandler
  implements ICommandHandler<DeleteDpsCommand, CommandResponse<boolean>>
{
  constructor(
    private readonly securityContextProvider: SecurityContextProvider,
    @Inject(DPS_REPOSITORY)
    private readonly dpsRepository: IDpsRepository,
  ) {}
  async execute(command: DeleteDpsCommand): Promise<CommandResponse<boolean>> {
    try {
      const response = await this.dpsRepository.deleteDps(command.id);
      return CommandResponse.success(response);
    } catch (error) {
      return CommandResponse.failure();
    }
  }
}
