import mongoose, { Document, Schema } from 'mongoose';

export interface IMeasure extends Document {
  customer_code: string;
  measure_datetime: Date;
  measure_type: string;
  measure_value: number;
  image_url: string;
  measure_uuid: string;
  confirmed?: boolean; 
}

const measureSchema: Schema = new Schema({
  customer_code: { type: String, required: true },
  measure_datetime: { type: Date, required: true },
  measure_type: { type: String, required: true },
  measure_value: { type: Number, required: true },
  image_url: { type: String, required: true },
  measure_uuid: { type: String, required: true },
  confirmed: { type: Boolean, default: false } 
});

const Measure = mongoose.model<IMeasure>('Measure', measureSchema);

export default Measure;
