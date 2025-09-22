export class EntityBase {
  constructor(
    public readonly id: string,
    public readonly tenantId?: string,
    public readonly createdBy?: string,
    public readonly lastUpdatedBy?: string,
    public readonly createdAt?: Date | number,
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
    this.rolesAllowedToRead = rolesAllowedToRead ? rolesAllowedToRead : [];
    this.rolesAllowedToUpdate = rolesAllowedToUpdate
      ? rolesAllowedToUpdate
      : [];
    this.rolesAllowedToDelete = rolesAllowedToDelete
      ? rolesAllowedToDelete
      : [];
    this.idsAllowedToRead = idsAllowedToRead ? idsAllowedToRead : [];
    this.idsAllowedToUpdate = idsAllowedToUpdate ? idsAllowedToUpdate : [];
    this.idsAllowedToDelete = idsAllowedToDelete ? idsAllowedToDelete : [];
  }
}
