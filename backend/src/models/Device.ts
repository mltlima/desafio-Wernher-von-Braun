import { Schema, model, Document } from 'mongoose';

interface ICommand {
  command: string;
  parameters: string[];
}

export interface IDevice extends Document {
  identifier: string;
  description: string;
  manufacturer: string;
  url: string;
  commands: ICommand[];
}

const CommandSchema = new Schema<ICommand>({
  command: { type: String, required: true },
  parameters: [{ type: String }]
});

const DeviceSchema = new Schema<IDevice>({
  identifier: { type: String, required: true },
  description: { type: String, required: true },
  manufacturer: { type: String, required: true },
  url: { type: String, required: true },
  commands: [CommandSchema]
});

export default model<IDevice>('Device', DeviceSchema);
