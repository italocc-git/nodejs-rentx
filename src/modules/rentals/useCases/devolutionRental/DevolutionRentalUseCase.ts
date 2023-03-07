import { AppError } from '@shared/errors/AppError';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { inject, injectable } from 'tsyringe';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';

interface IRequest {
    rental_id: string;
    user_id: string;
}
@injectable()
class DevolutionRentalUseCase {
    constructor(
        @inject('RentalsRepository')
        private rentalsRepository: IRentalsRepository,
        @inject('CarsRepository')
        private carsRepository: ICarsRepository,
        @inject('DayjsDateProvider')
        private dayjsDateProvider: IDateProvider,
    ) {}

    async execute({ rental_id, user_id }: IRequest): Promise<Rental> {
        const rental = await this.rentalsRepository.findById(rental_id);
        const car = await this.carsRepository.findById(rental.car_id);

        const minimum_daily = 1;
        if (!rental) {
            throw new AppError('Rental does not exists');
        }
        const dateNow = this.dayjsDateProvider.dateNow();

        /* Verificar quantidade de diárias */
        let daily = this.dayjsDateProvider.compareInDays(
            rental.start_date,
            dateNow,
        );

        if (daily <= 0) {
            daily = minimum_daily;
        }
        /* calcular dias de atraso */
        const delay = this.dayjsDateProvider.compareInDays(
            dateNow,
            rental.expected_return_date,
        );

        let total = 0;

        if (delay > 0) {
            const calculate_fine = delay * car.fine_amount;
            total = calculate_fine;
        }

        /*  quantidade de diárias vezes o valor da diária */
        total += daily * car.daily_rate;

        rental.end_date = this.dayjsDateProvider.dateNow();

        rental.total = total;

        await this.rentalsRepository.create(rental);
        await this.carsRepository.updateAvailable(car.id, true);

        return rental;
    }
}

export { DevolutionRentalUseCase };
