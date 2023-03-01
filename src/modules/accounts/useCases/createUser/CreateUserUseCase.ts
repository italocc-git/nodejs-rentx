/* eslint-disable prettier/prettier */
import { inject, injectable } from 'tsyringe';
import { hash } from 'bcryptjs'
import { AppError } from "@shared/errors/AppError";
import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';

type IRequest = ICreateUserDTO

@injectable()
class CreateUserUseCase {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ) { }

    async execute({
        name,
        email,
        password,
        driver_license,
    }: IRequest): Promise<void> {

        const passwordHashed = await hash(password, 8)

        const userAlreadyExists = await this.usersRepository.findByEmail(email)

        if (userAlreadyExists) throw new AppError('User already exists')

        await this.usersRepository.create({
            name,
            email,
            driver_license,
            password: passwordHashed,
        });
    }
}

export { CreateUserUseCase };
