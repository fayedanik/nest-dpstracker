import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import * as fs from 'node:fs';
import * as process from 'node:process';
import * as path from 'node:path';
import * as constants from 'node:constants';
import { BankListResponseDto } from '../dtos/response-dtos/bank-list-response.dto';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { Role } from '../../shared/consts/role.const';

@Controller('AdminCommand')
export class AdminCommandController {
  @Get('ParseBankList')
  @Roles([Role.Admin])
  @UseGuards(JwtAuthGuard, RolesGuard)
  public async ParseBankList(@Res() res: Response) {
    const { readFile, access } = fs.promises;
    const filePath = path.join(process.cwd(), 'assets/bank_list.json');
    try {
      await access(filePath, constants.F_OK);
      const data = await readFile(filePath, 'utf8');
      const bankList = JSON.parse(data);
      const result = bankList.map((bank) => {
        return {
          name: bank.name,
          bank_code: bank.bank_code,
          districts: bank.districts.map((district) => ({
            district_name: district.district_name,
            branches: district.branches.map((branch) => ({
              routing_number: branch.routing_number,
              swiftCode: branch.swiftCode,
              branch_name: branch.branch_name
            })),
          })),
        } as BankListResponseDto;
      });
      return res.status(HttpStatus.OK).json(result);
    } catch (err) {
      console.log(err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({});
    }
  }
}
