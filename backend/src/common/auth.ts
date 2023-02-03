import { Response, NextFunction } from 'express';
import passport from 'passport';
import { Strategy as JwtStrategy, VerifiedCallback } from 'passport-jwt';
import { IRequest } from '../../types';
import { ITokenPayload } from './token';
import config from './vars';
import User from '../datasource/models/user.model';
import { IUser } from '../datasource/types';
import { UnauthorizedError } from '../utils/errors/UnauthorizedError';

const tokenExtractor = (req: IRequest) => (req && req.signedCookies ? req.signedCookies[config.cookieName] : null);

export const initJwtStrategy = function (): void {
    const opts = {
        jwtFromRequest: tokenExtractor,
        secretOrKey: config.auth.jwtSecret,
    };

    passport.use(
        'jwt',
        new JwtStrategy(opts, async (jwtPayload: ITokenPayload, done: VerifiedCallback) => {
            try {
                const user = await User.findOne({
                    _id: jwtPayload.id,
                });

                console.log({ user });

                if (user) {
                    done(null, user as IUser);
                } else {
                    done(null, false, { message: 'User not found' });
                }
            } catch (e) {
                done(null, false, { message: 'User not found' });
            }
        }),
    );
};

export function authMiddleware(req: IRequest, res: Response, next: NextFunction): void {
    const authCallback = (err: Error, user: IUser) => {
        console.log({ user });

        try {
            if (err || !user) {
                return next(new UnauthorizedError());
            }
            req.data = req.data || {};
            req.data.user = user;
            return next();
        } catch (error) {
            return next(error);
        }
    };
    return passport.authenticate('jwt', { session: false }, authCallback)(req, res, next);
}

export function withUser(req: IRequest, res: Response, next: NextFunction): void {
    const cb = (err: Error, user: IUser) => {
        req.data = req.data || {};
        req.data.user = user;
        return next();
    };
    return passport.authenticate('jwt', { session: false }, cb)(req, res, next);
}
