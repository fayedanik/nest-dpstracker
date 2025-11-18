import { BaseQuery } from './base.query';

export class GetTransactionsQuery extends BaseQuery {
  constructor(
    public type: string,
    public pageIndex: number,
    public pageLimit: number,
  ) {
    super();
  }
}
