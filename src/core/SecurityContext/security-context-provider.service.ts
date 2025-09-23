import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { Observable } from 'rxjs';
import {
  ISecurityContext,
  ISecurityContextProvider,
} from './security-context.interface';

@Injectable()
export class SecurityContextProvider implements ISecurityContextProvider {
  private readonly storage = new AsyncLocalStorage<ISecurityContext>();
  private _context: ISecurityContext;
  run(context: ISecurityContext, cb: () => Observable<any>): Observable<any> {
    return this.storage.run(context, cb);
  }
  getSecurityContext() {
    return this.storage.getStore() as ISecurityContext;
  }
}
