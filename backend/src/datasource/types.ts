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
    nobodyInCallSince?: Date;
    chatMessagesListenerWorks?: Boolean;

    toDto: (...args: unknown[]) => Promise<Record<string, unknown>>;
}

export interface IMessage extends Document {
    _id: Types.ObjectId;
    text: String;
    senderName: String;
    senderId: String;

    toDto: () => Promise<Record<string, unknown>>;
}
