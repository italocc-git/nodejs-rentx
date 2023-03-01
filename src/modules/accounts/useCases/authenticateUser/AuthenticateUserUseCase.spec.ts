import { AppError } from '@shared/errors/AppError';
import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { AuthenticateUserUseCase } from './authenticateUserUseCase';

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;

describe('Authenticate User', () => {
    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        authenticateUserUseCase = new AuthenticateUserUseCase(
            usersRepositoryInMemory,
        );
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    });

    it('should be able to authenticate an user', async () => {
        const user: ICreateUserDTO = {
            driver_license: '00012345',
            email: 'user@test.com',
            password: '12345',
            name: 'User Test',
        };
        await createUserUseCase.execute(user);
        /* First create user and then authenticate */

        const result = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password,
        });

        expect(result).toHaveProperty('token');
    });

    it('should not be able to authenticate an nonexistent user', async () => {
        await expect(async () => {
            const user: ICreateUserDTO = {
                driver_license: '0000012345',
                email: 'user2@test.com',
                password: '12345',
                name: 'User Test2',
            };
            await createUserUseCase.execute(user);
            await authenticateUserUseCase.execute({
                email: 'wrong-user@test.com',
                password: user.password,
            });
        }).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to authenticate an user with wrong password', async () => {
        await expect(async () => {
            const user: ICreateUserDTO = {
                driver_license: '0000012345',
                email: 'user3@test.com',
                password: '12345',
                name: 'User Test2',
            };
            await createUserUseCase.execute(user);

            await authenticateUserUseCase.execute({
                email: user.email,
                password: '123',
            });
        }).rejects.toBeInstanceOf(AppError);
    });
});
