import { Document, Types } from 'mongoose';

export interface IUser extends Document {
    _id: Types.ObjectId;
    username: String;

    toDto: (...args: unknown[]) => Promise<Record<string, unknown>>;
}
