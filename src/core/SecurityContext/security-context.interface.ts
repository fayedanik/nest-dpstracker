import { Observable } from 'rxjs';

export interface ISecurityContext {
  userId: string;
  email: string;
  roles: string[];
  tenantId: string;
}

export interface ISecurityContextProvider {
  run(context: ISecurityContext, cb: () => Observable<any>): Observable<any>;
  getSecurityContext(): ISecurityContext;
}
