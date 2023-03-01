import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import dayjs from 'dayjs';
import { AppError } from '../../../../shared/errors/AppError';
import { CreateRentalUseCase } from './CreateRentalUseCase';

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let dateProvider: DayjsDateProvider;
describe('Create Rental', () => {
    const dayAdd24Hours = dayjs().add(1, 'day').toDate();
    beforeEach(() => {
        rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
        dateProvider = new DayjsDateProvider();
        createRentalUseCase = new CreateRentalUseCase(
            rentalsRepositoryInMemory,
            dateProvider,
        );
    });

    it('should be able to create a new Rental', async () => {
        const rental = await createRentalUseCase.execute({
            car_id: '121212',
            user_id: '1234567',
            expected_return_date: dayAdd24Hours,
        });

        expect(rental).toHaveProperty('id');
        expect(rental).toHaveProperty('start_date');
    });

    it('should not be able to create a new Rental if there´s another open to the same user', async () => {
        expect(async () => {
            await createRentalUseCase.execute({
                car_id: '12333333',
                user_id: '1234567',
                expected_return_date: dayAdd24Hours,
            });
            await createRentalUseCase.execute({
                car_id: '12399999',
                user_id: '1234567',
                expected_return_date: dayAdd24Hours,
            });
        }).rejects.toBeInstanceOf(AppError);
    });
    it('should not be able to create a new Rental if there´s another open to the same car', async () => {
        expect(async () => {
            await createRentalUseCase.execute({
                car_id: 'test-id',
                user_id: '1239874561',
                expected_return_date: dayAdd24Hours,
            });
            await createRentalUseCase.execute({
                car_id: 'test-id',
                user_id: '1233333',
                expected_return_date: dayAdd24Hours,
            });
        }).rejects.toBeInstanceOf(AppError);
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
