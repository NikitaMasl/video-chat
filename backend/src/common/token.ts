import { sign, verify } from 'jsonwebtoken';
import config from './vars';
import { IUser } from '../datasource/types';
import { UnauthorizedError } from '../utils/errors/UnauthorizedError';

export interface ITokenPayload {
    id: string;
    exp: string;
    callId?: string;
}

export function generateAccessToken(user: IUser): string {
    return sign(
        {
            id: user.id || user._id.toString(),
        },
        config.auth.jwtSecret,
        {
            expiresIn: config.auth.accessTokenMaxAgeInMs,
        },
    );
}

export function verifyToken(token: string): ITokenPayload {
    try {
        return verify(token, config.auth.jwtSecret) as unknown as ITokenPayload;
    } catch (e) {
        throw new UnauthorizedError();
    }
}
