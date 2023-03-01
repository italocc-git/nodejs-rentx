/* eslint-disable prettier/prettier */
import { inject, injectable } from 'tsyringe';
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken';
import { AppError } from "@shared/errors/AppError";
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';

interface IRequest {
    email: string;
    password: string;
}
interface IResponse {
    user: {
        name: string;
        email: string;
    },
    token: string;
}
@injectable()
class AuthenticateUserUseCase {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ) { }

    async execute({ email, password }: IRequest): Promise<IResponse> {
        const user = await this.usersRepository.findByEmail(email);
        if (!user) {
            throw new AppError('Email or Password incorrect!');
        }

        const passwordMatch = await compare(password, user.password)

        if (!passwordMatch) throw new AppError('Email or Password incorrect!');

        const token = sign({}, '0a8d82e5d4d1ba8bde71e571ace4a3a3', {
            subject: user.id,
            expiresIn: '1d'
        })

        return {
            user: {
                name: user.name,
                email: user.email
            },
            token
        }

    }
}

export { AuthenticateUserUseCase };
