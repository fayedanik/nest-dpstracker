import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandBus } from '@nestjs/cqrs';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { IAppConfig } from 'src/shared/interfaces/app-config.interface';
import { LogoutCommand } from '../../../application/commands/log-out.command';
import { LoginCommand } from '../../../application/commands/login.command';
import { RefreshTokenCommand } from '../../../application/commands/refresh-token.command';
import { RefreshTokenCommandDto } from '../../dtos/comand-dtos/refresh-token-command.dto';
import { LoginCommandResponseDto } from '../../dtos/response-dtos/login-command-response.dto';
import { RefreshTokenCommandResponseDto } from '../../dtos/response-dtos/refresh-command-response.dto';
import { CommandResponse } from '../../../shared/generic-class/command-response.class';
import { CookieService } from '../../../shared/services/cookie.service';
import { LoginCommandDto } from '../../dtos/comand-dtos/login-command.dto';

@Controller('IdentityCommand')
export class IdentityCommandController {
  private readonly _refreshCookie = 'refresh_token';
  private _refreshTokenCookieExperity = 604800 * 1000;
  constructor(
    private readonly commandBus: CommandBus,
    private cookieService: CookieService,
    private configService: ConfigService<IAppConfig>,
  ) {
    this._refreshTokenCookieExperity =
      this.configService.get('ACCESS_TOKEN_EXPIRTY_IN_MINUTES') *
      24 *
      60 *
      60 *
      1000;
  }

  @Post('Login')
  @HttpCode(HttpStatus.OK)
  async Login(
    @Body() dto: LoginCommandDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const command = new LoginCommand(dto.email, dto.password);
    const response = await this.commandBus.execute<
      LoginCommand,
      CommandResponse<LoginCommandResponseDto>
    >(command);
    if (!response || !response.success || !response.data) {
      this.cookieService.clearCookie(res, this._refreshCookie);
      throw new UnauthorizedException(response.message);
    }
    this.cookieService.setCookie(
      res,
      this._refreshCookie,
      response.data.refresh_token,
      { maxAge: this._refreshTokenCookieExperity },
    );
    return response;
  }
  @Post('Refresh')
  @HttpCode(HttpStatus.OK)
  async Refresh(
    @Body() dto: RefreshTokenCommandDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    let refreshToken = req.cookies[`${this._refreshCookie}`] as string;
    if (!refreshToken) {
      refreshToken = req.body['refresh_token'];
    }
    if (!refreshToken) {
      throw new UnauthorizedException('Unauthorized');
    }
    const command = new RefreshTokenCommand(refreshToken);
    const response = await this.commandBus.execute<
      RefreshTokenCommand,
      CommandResponse<RefreshTokenCommandResponseDto>
    >(command);
    if (!response || !response.success || !response.data) {
      this.cookieService.clearCookie(res, this._refreshCookie);
      throw new UnauthorizedException(response.message);
    }
    this.cookieService.setCookie(
      res,
      this._refreshCookie,
      response.data.refresh_token,
      { maxAge: this._refreshTokenCookieExperity },
    );
    return response;
  }

  @Post('Logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async LogOut(@Res({ passthrough: true }) res: Response) {
    const command = new LogoutCommand();
    const response = await this.commandBus.execute<LogoutCommand, boolean>(
      command,
    );
    if (response) {
      this.cookieService.clearCookie(res, this._refreshCookie);
    }
    return response;
  }
}
