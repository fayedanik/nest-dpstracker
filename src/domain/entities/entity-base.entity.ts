import { Role } from '../../shared/consts/role.const';

export class EntityBase {
  constructor(
    public id: string,
    public tenantId?: string,
    public createdBy?: string,
    public lastUpdatedBy?: string,
    public createdAt?: Date | number | string,
    public updatedAt?: Date | number,
    public rolesAllowedToRead?: string[],
    public rolesAllowedToUpdate?: string[],
    public rolesAllowedToDelete?: string[],
    public idsAllowedToRead?: string[],
    public idsAllowedToUpdate?: string[],
    public idsAllowedToDelete?: string[],
  ) {
    this.tenantId = process.env.TENANT_ID;
    this.createdAt = createdAt ? createdAt : Date.now();
    this.updatedAt = updatedAt ? updatedAt : Date.now();
    this.rolesAllowedToRead = rolesAllowedToRead
      ? rolesAllowedToRead
      : [Role.SuperAdmin, Role.Admin];
    this.rolesAllowedToUpdate = rolesAllowedToUpdate
      ? rolesAllowedToUpdate
      : [Role.SuperAdmin, Role.Admin];
    this.rolesAllowedToDelete = rolesAllowedToDelete
      ? rolesAllowedToDelete
      : [Role.SuperAdmin, Role.Admin];
    this.idsAllowedToRead = idsAllowedToRead ? idsAllowedToRead : [];
    this.idsAllowedToUpdate = idsAllowedToUpdate ? idsAllowedToUpdate : [];
    this.idsAllowedToDelete = idsAllowedToDelete ? idsAllowedToDelete : [];
  }

  public addPdsInfo(loggedInUserId: string) {
    this.createdBy = loggedInUserId;
    this.lastUpdatedBy = loggedInUserId;
    this.idsAllowedToRead = [
      ...new Set([...(this.idsAllowedToRead ?? []), loggedInUserId]),
    ];
    this.idsAllowedToUpdate = [
      ...new Set([...(this.idsAllowedToUpdate ?? []), loggedInUserId]),
    ];
    this.idsAllowedToDelete = [
      ...new Set([...(this.idsAllowedToDelete ?? []), loggedInUserId]),
    ];
    return this;
  }
}
