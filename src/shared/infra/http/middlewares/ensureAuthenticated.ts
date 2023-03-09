import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { UsersRepository } from '@modules/accounts/infra/typeorm/repositories/UsersRepository';
import { AppError } from '@shared/errors/AppError';
import auth from '@config/auth';
import { UsersTokensRepository } from '@modules/accounts/infra/typeorm/repositories/UsersTokensRepository';

interface IPayload {
    sub: string;
}

async function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction,
) {
    const authHeader = request.headers.authorization;

    const userTokensRepository = new UsersTokensRepository();

    if (!authHeader) throw new AppError('Token missing', 401);

    const [bearer, tokenCode] = authHeader.split(' ');

    try {
        /* For now it will be able to get the refresh token instead token itself */
        const { sub: user_id } = verify(
            tokenCode,
            auth.expires_in_refresh_token,
        ) as IPayload;

        const user = await userTokensRepository.findByUserIdAndRefreshToken(
            user_id,
            tokenCode,
        );

        if (!user) throw new AppError('User doesn´t exists', 401);

        request.user = {
            id: user_id,
        };
        next();
    } catch (error) {
        throw new AppError('Token invalid!', 401);
    }
}

export { ensureAuthenticated };
