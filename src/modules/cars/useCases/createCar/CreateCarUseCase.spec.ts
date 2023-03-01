import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { AppError } from '../../../../shared/errors/AppError';
import { CreateCarUseCase } from './CreateCarUseCase';

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
describe('Create Car', () => {
    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
    });

    it('should be able to create a new car', async () => {
        const car = await createCarUseCase.execute({
            name: 'Gol 1.0',
            description: 'ComfortLine 2015',
            daily_rate: 100,
            license_plate: 'OSI-3810',
            fine_amount: 60,
            brand: 'Volkswagen',
            category_id: 'category',
        });
        expect(car).toHaveProperty('id');
    });
    it('should not be able to create a car with exists license plate', async () => {
        await expect(async () => {
            await createCarUseCase.execute({
                name: 'Gol 1.0',
                description: 'ComfortLine 2015',
                daily_rate: 100,
                license_plate: 'OSI-3810',
                fine_amount: 60,
                brand: 'Volkswagen',
                category_id: 'category',
            });
            await createCarUseCase.execute({
                name: 'Gol 1.6',
                description: 'ComfortLine 2015',
                daily_rate: 100,
                license_plate: 'OSI-3810',
                fine_amount: 60,
                brand: 'Volkswagen',
                category_id: 'category',
            });
        }).rejects.toBeInstanceOf(AppError);
    });
    it('should be able to create a car with available true by default', async () => {
        const car = await createCarUseCase.execute({
            name: 'Car Available',
            description: 'Description Car',
            daily_rate: 100,
            license_plate: 'ABCD-1234',
            fine_amount: 60,
            brand: 'Brand',
            category_id: 'category',
        });

        expect(car.available).toBe(true);
    });
});
