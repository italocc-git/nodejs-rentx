import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { UsersRepository } from '@modules/accounts/infra/typeorm/repositories/UsersRepository';
import { AppError } from '@shared/errors/AppError';

interface IPayload {
    sub: string;
}

async function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction,
) {
    const authHeader = request.headers.authorization;

    if (!authHeader) throw new AppError('Token missing', 401);

    const [bearer, tokenCode] = authHeader.split(' ');

    try {
        const { sub: user_id } = verify(
            tokenCode,
            '0a8d82e5d4d1ba8bde71e571ace4a3a3',
        ) as IPayload;

        const usersRepository = new UsersRepository();

        const user = usersRepository.findById(user_id);

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
