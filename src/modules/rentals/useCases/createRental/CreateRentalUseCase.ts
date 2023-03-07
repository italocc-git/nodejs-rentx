import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { inject, injectable } from 'tsyringe';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '../../../../shared/errors/AppError';

interface IRequest {
    user_id: string;
    car_id: string;
    expected_return_date: Date;
}
@injectable()
class CreateRentalUseCase {
    constructor(
        @inject('RentalsRepository')
        private rentalsRepository: IRentalsRepository,
        @inject('DayjsDateProvider')
        private dayjsDateProvider: IDateProvider,
        @inject('CarsRepository')
        private carsRepository: ICarsRepository,
    ) {}
    async execute({
        car_id,
        user_id,
        expected_return_date,
    }: IRequest): Promise<Rental> {
        /* - Não deve ser possível cadastrar um novo aluguel caso já - exista um aberto para o mesmo carro */
        const carUnavailable = await this.rentalsRepository.findOpenRentalByCar(
            car_id,
        );

        if (carUnavailable) {
            throw new AppError('Car is unavailable');
        }

        /* - Não deve ser possível cadastrar um novo aluguel caso já - exista um aberto para o mesmo usuário */
        const rentalOpenToUser =
            await this.rentalsRepository.findOpenRentalByUser(user_id);

        if (rentalOpenToUser) {
            throw new AppError('There´s a rental in progress for user!');
        }

        const dateNow = this.dayjsDateProvider.dateNow();

        const compare = this.dayjsDateProvider.compareInHours(
            dateNow,
            expected_return_date,
        );

        /* - O aluguel deve ter duração mínima de 24 horas. */

        if (compare < 24) {
            throw new AppError('Invalid return time!');
        }
        const rental = await this.rentalsRepository.create({
            car_id,
            user_id,
            expected_return_date,
        });

        await this.carsRepository.updateAvailable(car_id, false);

        return rental;
    }
}

export { CreateRentalUseCase };
