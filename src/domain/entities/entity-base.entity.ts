import { Role } from '../../shared/consts/role.const';

export class EntityBase {
  constructor(
    public readonly id: string,
    public readonly tenantId?: string,
    public readonly createdBy?: string,
    public readonly lastUpdatedBy?: string,
    public readonly createdAt?: Date | number | string,
    public readonly updatedAt?: Date | number,
    public readonly rolesAllowedToRead?: string[],
    public readonly rolesAllowedToUpdate?: string[],
    public readonly rolesAllowedToDelete?: string[],
    public readonly idsAllowedToRead?: string[],
    public readonly idsAllowedToUpdate?: string[],
    public readonly idsAllowedToDelete?: string[],
  ) {
    this.createdBy = this.id;
    this.tenantId = process.env.TENANT_ID;
    this.lastUpdatedBy = this.id;
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
    this.idsAllowedToRead = idsAllowedToRead ? idsAllowedToRead : [this.id];
    this.idsAllowedToUpdate = idsAllowedToUpdate
      ? idsAllowedToUpdate
      : [this.id];
    this.idsAllowedToDelete = idsAllowedToDelete
      ? idsAllowedToDelete
      : [this.id];
  }
}
