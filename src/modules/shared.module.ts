import { Module } from '@nestjs/common';
import { CookieService } from '../shared/services/cookie.service';

@Module({
  imports: [],
  exports: [CookieService],
  providers: [CookieService],
})
export class SharedModule {}
