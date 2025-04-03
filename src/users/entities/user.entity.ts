import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from '../dto/create-user.dto';

@Schema()
export class User extends Document {
  @Prop({
    unique: true,
    required: true,
    index: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  fullName: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    default: UserRole.USER,
    enum: UserRole,
  })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
