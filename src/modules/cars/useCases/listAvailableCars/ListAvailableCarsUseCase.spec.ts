import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase';

let carsRepositoryInMemory: CarsRepositoryInMemory;
let listAvailableCarsUseCase: ListAvailableCarsUseCase;
describe('List Cars', () => {
    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        listAvailableCarsUseCase = new ListAvailableCarsUseCase(
            carsRepositoryInMemory,
        );
    });

    it('should be able to list all available cars', async () => {
        const car = await carsRepositoryInMemory.create({
            name: 'Car1',
            description: 'Car description',
            daily_rate: 110.0,
            license_plate: 'DEF-1234',
            fine_amount: 40,
            brand: 'Car_brand',
            category_id: 'category_id',
        });

        const cars = await listAvailableCarsUseCase.execute({});

        expect(cars).toEqual([car]);
    });

    it('should be able to list all available cars by brand', async () => {
        const car = await carsRepositoryInMemory.create({
            name: 'Car2',
            description: 'Car description',
            daily_rate: 110.0,
            license_plate: 'DEF-1234',
            fine_amount: 40,
            brand: 'Car_brand_test',
            category_id: 'category_id',
        });

        const cars = await listAvailableCarsUseCase.execute({
            brand: 'Car_brand_test',
        });

        expect(cars).toEqual([car]);
    });
    it('should be able to list all available cars by name', async () => {
        const car = await carsRepositoryInMemory.create({
            name: 'carTestName',
            description: 'Car description',
            daily_rate: 110.0,
            license_plate: 'DEF-5554',
            fine_amount: 40,
            brand: 'Car_brand_test_30',
            category_id: 'category_id',
        });

        const cars = await listAvailableCarsUseCase.execute({
            name: 'carTestName',
        });

        expect(cars).toEqual([car]);
    });

    it('should be able to list all available cars by category', async () => {
        const car = await carsRepositoryInMemory.create({
            name: 'Car50',
            description: 'Car description',
            daily_rate: 110.0,
            license_plate: 'DEF-3311',
            fine_amount: 40,
            brand: 'Car_brand_test_50',
            category_id: '12345654411',
        });

        const cars = await listAvailableCarsUseCase.execute({
            category_id: '12345654411',
        });

        expect(cars).toEqual([car]);
    });
});
