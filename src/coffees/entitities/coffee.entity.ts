import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Coffee extends Document {
  // mongo add and _id
  @Prop()
  name: string;

  @Prop()
  brand: string;

  @Prop([String])
  flavors: string[];

  @Prop({ default: 0 })
  recommendations: number;
}
export const CoffeeSchema = SchemaFactory.createForClass(Coffee);