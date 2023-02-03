import { Document, Types } from 'mongoose';

export interface IUser extends Document {
    _id: Types.ObjectId;
    username: String;

    toDto: (...args: unknown[]) => Promise<Record<string, unknown>>;
}

export interface ICall extends Document {
    _id: Types.ObjectId;
    owner: String;
    callMembers?: { userId: String }[];

    toDto: (...args: unknown[]) => Promise<Record<string, unknown>>;
}
