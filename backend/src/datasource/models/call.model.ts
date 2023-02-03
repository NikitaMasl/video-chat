import mongoose, { Schema, Document, PaginateModel } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import mongoosePaginate from 'mongoose-paginate-v2';
import { DTO_FORMATS } from '../../const/calls/DTO_FORMATS';
import { ICall } from '../types';

interface Dto {
    format: DTO_FORMATS;
}

const callScheme = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    callMembers: [
        {
            userId: String,
        },
    ],
});

callScheme.plugin(uniqueValidator);

callScheme.methods.toDto = async function toDto({ format }: Dto = {} as Dto) {
    return {
        id: this._id,
    };
};

callScheme.plugin(mongoosePaginate);

type CallModel<T extends Document> = PaginateModel<T>;
const CallModel: CallModel<ICall> = mongoose.model<ICall>('Call', callScheme) as CallModel<ICall>;

export default CallModel;
