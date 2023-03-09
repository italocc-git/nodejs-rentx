import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
/* eslint-disable prettier/prettier */
import { inject, injectable } from 'tsyringe';
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken';
import { AppError } from "@shared/errors/AppError";
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import auth from '@config/auth';

interface IRequest {
    email: string;
    password: string;
}
interface IResponse {
    user: {
        name: string;
        email: string;
    },
    token: string,
    refresh_token : string
}
@injectable()
class AuthenticateUserUseCase {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('UsersTokensRepository')
        private usersTokensRepository : IUsersTokensRepository,
        @inject('DayjsDateProvider')
        private dayJsDateProvider : IDateProvider
    ) { }

    async execute({ email, password }: IRequest): Promise<IResponse> {
        const user = await this.usersRepository.findByEmail(email);
        if (!user) {
            throw new AppError('Email or Password incorrect!');
        }

        const passwordMatch = await compare(password, user.password)

        if (!passwordMatch) throw new AppError('Email or Password incorrect!');

        const token = sign({}, auth.secret_token, {
            subject: user.id,
            expiresIn: auth.expires_in_token
        })

        const refresh_token = sign({email} , auth.secret_refresh_token, {
            subject: user.id,
            expiresIn: auth.expires_in_refresh_token
        })
        const expires_date = this.dayJsDateProvider.addDays(auth.expires_refresh_token_days)

        await this.usersTokensRepository.create({
            user_id : user.id,
            expires_date,
            refresh_token,

        })

        return {
            user: {
                name: user.name,
                email: user.email
            },
            token,
            refresh_token
        }

    }
}

export { AuthenticateUserUseCase };
