import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import dayjs from 'dayjs';
import { AppError } from '../../../../shared/errors/AppError';
import { CreateRentalUseCase } from './CreateRentalUseCase';

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepository: CarsRepositoryInMemory;
let dateProvider: DayjsDateProvider;
describe('Create Rental', () => {
    const dayAdd24Hours = dayjs().add(1, 'day').toDate();
    beforeEach(() => {
        rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
        dateProvider = new DayjsDateProvider();
        carsRepository = new CarsRepositoryInMemory();
        createRentalUseCase = new CreateRentalUseCase(
            rentalsRepositoryInMemory,
            dateProvider,
            carsRepository,
        );
    });

    it('should be able to create a new Rental', async () => {
        const car = await carsRepository.create({
            name: 'test',
            description: 'Car Test Description',
            daily_rate: 100,
            license_plate: 'Test-plate',
            fine_amount: 40,
            category_id: '1234',
            brand: 'brand-test',
        });

        const rental = await createRentalUseCase.execute({
            car_id: car.id,
            user_id: '1234567',
            expected_return_date: dayAdd24Hours,
        });

        expect(rental).toHaveProperty('id');
        expect(rental).toHaveProperty('start_date');
    });

    it('should not be able to create a new Rental if there´s another open to the same user', async () => {
        await rentalsRepositoryInMemory.create({
            car_id: '1111',
            expected_return_date: dayAdd24Hours,
            user_id: '12345',
        });

        await expect(
            createRentalUseCase.execute({
                user_id: '12345',
                car_id: '121212',
                expected_return_date: dayAdd24Hours,
            }),
        ).rejects.toEqual(
            new AppError('There´s a rental in progress for user!'),
        );
    });
    it('should not be able to create a new Rental if there´s another open to the same car', async () => {
        await rentalsRepositoryInMemory.create({
            car_id: 'test',
            expected_return_date: dayAdd24Hours,
            user_id: '12345',
        });

        await expect(
            createRentalUseCase.execute({
                user_id: '321',
                car_id: 'test',
                expected_return_date: dayAdd24Hours,
            }),
        ).rejects.toEqual(new AppError('Car is unavailable'));
    });
    it(' should not be able to create a new rental with invalid return time ', async () => {
        await expect(
            createRentalUseCase.execute({
                user_id: '123',
                car_id: 'test',
                expected_return_date: dayjs().toDate(),
            }),
        ).rejects.toEqual(new AppError('Invalid return time!'));
    });
});
