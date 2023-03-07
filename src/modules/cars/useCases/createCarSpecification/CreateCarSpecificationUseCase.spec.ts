import { AppError } from '@shared/errors/AppError';
import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { SpecificationsRepositoryInMemory } from '@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory';
import { CreateCarSpecificationUseCase } from './CreateCarSpecificationUseCase';

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;
describe('Create Car Specification', () => {
    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        specificationsRepositoryInMemory =
            new SpecificationsRepositoryInMemory();

        createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
            carsRepositoryInMemory,
            specificationsRepositoryInMemory,
        );
    });

    it('should not be able to add a new specification to a no-existent car', async () => {
        const car_id = '1234';
        const specifications_id = ['54321'];

        await expect(
            createCarSpecificationUseCase.execute({
                car_id,
                specifications_id,
            }),
        ).rejects.toEqual(new AppError('Car doesn´t exists'));
    });

    it('should be able to add a new specification to the car', async () => {
        const car = await carsRepositoryInMemory.create({
            name: 'Gol 1.0',
            description: 'ComfortLine 2015',
            daily_rate: 100,
            license_plate: 'OSI-3810',
            fine_amount: 60,
            brand: 'Volkswagen',
            category_id: 'category',
        });

        const specification = await specificationsRepositoryInMemory.create({
            description: 'test',
            name: 'test',
        });
        const specifications_id = [specification.id];

        const specificationCars = await createCarSpecificationUseCase.execute({
            car_id: car.id,
            specifications_id,
        });

        expect(specificationCars).toHaveProperty('specifications');
        expect(specificationCars.specifications.length).toBe(1);
    });
});
