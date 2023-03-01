import { CreateRentalController } from '@modules/rentals/useCases/createRental/CreateRentalController';
import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const rentalRoutes = Router();

const rentalController = new CreateRentalController();

rentalRoutes.post('/', ensureAuthenticated, rentalController.handle);

export { rentalRoutes };
