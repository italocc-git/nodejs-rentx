import { Repository, getRepository } from 'typeorm';
import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { User } from '@modules/accounts/infra/typeorm/entities/User';
import { IUsersRepository } from '../../../repositories/IUsersRepository';

class UsersRepository implements IUsersRepository {
    private repository: Repository<User>;

    constructor() {
        this.repository = getRepository(User);
    }
    async findById(id: string): Promise<User> {
        const user = await this.repository.findOne(id);

        return user;
    }

    async findByEmail(email: string): Promise<User> {
        const findUserByEmail = await this.repository.findOne({
            email,
        });
        return findUserByEmail;
    }
    async create({
        name,
        email,
        password,
        driver_license,
        avatar,
        id,
    }: ICreateUserDTO): Promise<void> {
        const user = this.repository.create({
            name,
            email,
            password,
            driver_license,
            avatar,
            id,
        });

        await this.repository.save(user);
    }
}

export { UsersRepository };
