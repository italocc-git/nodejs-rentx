import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { ICreateRentalDTO } from '@modules/rentals/dtos/ICreateRentalDTO';

class RentalsRepositoryInMemory implements IRentalsRepository {
    rentals: Rental[] = [];

    async findOpenRentalByCar(car_id: string): Promise<Rental> {
        return this.rentals.find(
            rental => rental.car_id === car_id && !rental.end_date,
        );
    }
    async findByUser(user_id: string): Promise<Rental[]> {
        const rentals = await this.rentals.filter(
            rental => rental.user_id === user_id,
        );
        return rentals;
    }
    async findOpenRentalByUser(user_id: string): Promise<Rental> {
        return this.rentals.find(
            rental => rental.user_id === user_id && !rental.end_date,
        );
    }
    async create({
        car_id,
        expected_return_date,
        user_id,
    }: ICreateRentalDTO): Promise<Rental> {
        const rental = new Rental();

        Object.assign(rental, {
            user_id,
            car_id,
            expected_return_date,
            start_date: new Date(),
        });

        this.rentals.push(rental);

        return rental;
    }
    async findById(id: string): Promise<Rental> {
        return this.rentals.find(rental => rental.id === id);
    }
}

export { RentalsRepositoryInMemory };
