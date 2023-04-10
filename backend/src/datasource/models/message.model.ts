import mongoose, { Schema, Document, PaginateModel } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import mongoosePaginate from 'mongoose-paginate-v2';
import { IMessage } from '../types';

const messageScheme = new Schema({
    text: {
        type: String,
        required: true,
    },
    senderName: {
        type: String,
        required: true,
    },
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

messageScheme.plugin(uniqueValidator);

messageScheme.methods.toDto = async function toDto() {
    return {
        id: this._id,
        text: this.text,
        senderName: this.senderName,
        senderId: this.senderId,
    };
};

messageScheme.plugin(mongoosePaginate);

type MessageModel<T extends Document> = PaginateModel<T>;
const MessageModel: MessageModel<IMessage> = mongoose.model<IMessage>(
    'Message',
    messageScheme,
) as MessageModel<IMessage>;

export default MessageModel;
