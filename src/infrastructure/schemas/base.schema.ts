import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../../shared/consts/role.const';
import { v4 as uuidv4 } from 'uuid';

@Schema({ timestamps: true, versionKey: false })
export class BaseSchema extends Document {
  @Prop({ type: String, required: true, default: uuidv4 })
  declare _id: string;

  @Prop({ type: String })
  createdBy: string;
  @Prop({ type: String })
  lastUpdatedBy: string;

  @Prop({ type: [String], default: [Role.SuperAdmin, Role.Admin] })
  rolesAllowedToRead: string[];

  @Prop({ type: [String], default: [Role.SuperAdmin, Role.Admin] })
  rolesAllowedToUpdate: string[];

  @Prop({ type: [String], default: [Role.SuperAdmin, Role.Admin] })
  rolesAllowedToDelete: string[];

  @Prop({ type: [String], default: [] })
  idsAllowedToRead: string[];

  @Prop({ type: [String], default: [] })
  idsAllowedToUpdate: string[];

  @Prop({ type: [String], default: [] })
  idsAllowedToDelete: string[];

  @Prop({ type: String, required: true })
  tenantId: string;
}
