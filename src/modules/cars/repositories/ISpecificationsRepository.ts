import { Specification } from '@modules/cars/infra/typeorm/entities/Specification';

interface ICreateSpecificationDTO {
    name: string;
    description: string;
}
interface ISpecificationsRepository {
    findByName(name: string): Promise<Specification>;
    create({
        name,
        description,
    }: ICreateSpecificationDTO): Promise<Specification>;
    findByIds(ids: string[]): Promise<Specification[]>;
    /* list(): Specification[]; */
}

export { ISpecificationsRepository, ICreateSpecificationDTO };
