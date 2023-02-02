import mongoose, { Schema, Document, PaginateModel } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import mongoosePaginate from 'mongoose-paginate-v2';
import { DTO_FORMATS } from '../../const/users/DTO_FORMATS';
import { IUser } from '../types';

interface Dto {
    format: DTO_FORMATS;
}

const userScheme = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    isRegistered: {
        type: Boolean,
        default: false,
    },
});

userScheme.plugin(uniqueValidator);

userScheme.methods.toDto = async function toDto({ format }: Dto = {} as Dto) {
    return {
        id: this._id,
        username: this.username,
    };
};

userScheme.plugin(mongoosePaginate);

type UserModel<T extends Document> = PaginateModel<T>;
const UserModel: UserModel<IUser> = mongoose.model<IUser>('User', userScheme) as UserModel<IUser>;

export default UserModel;
