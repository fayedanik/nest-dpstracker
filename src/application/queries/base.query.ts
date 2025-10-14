import { v4 as uuidv4 } from 'uuid';

export class BaseQuery {
  messageCoId: string = uuidv4({});
  pageIndex: number;
  pageSize: number;
}
