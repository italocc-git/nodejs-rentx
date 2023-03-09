import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { MailProviderInMemory } from '@shared/container/providers/MailProvider/in-memory/MailProviderInMemory';
import { AppError } from '../../../../shared/errors/AppError';
import { SendForgotPasswordMailUseCase } from './SendForgotPasswordMailUseCase';

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersRepository: UsersRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let usersTokensRepository: UsersTokensRepositoryInMemory;
let mailProvider: MailProviderInMemory;
describe('Send Forgot Mail', () => {
    beforeEach(() => {
        usersRepository = new UsersRepositoryInMemory();
        usersTokensRepository = new UsersTokensRepositoryInMemory();
        dateProvider = new DayjsDateProvider();
        mailProvider = new MailProviderInMemory();
        sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
            usersRepository,
            usersTokensRepository,
            dateProvider,
            mailProvider,
        );
    });

    it('should be able to send a forgot password mail to user', async () => {
        const sendMail = spyOn(mailProvider, 'sendMail');

        await usersRepository.create({
            driver_license: '1548384920',
            email: 'vuh@mosa.om',
            name: 'Jimmy Bowen',
            password: 'VO2nIRJD',
        });

        await sendForgotPasswordMailUseCase.execute('vuh@mosa.om');

        expect(sendMail).toHaveBeenCalled();
    });
    it('should not be able to send an email with inexistent user', async () => {
        await expect(
            sendForgotPasswordMailUseCase.execute('sejic@wezejic.cz'),
        ).rejects.toEqual(new AppError('User doesn´t exists'));
    });

    it('should be able to create an users token', async () => {
        const generateTokenMail = spyOn(usersTokensRepository, 'create');

        usersRepository.create({
            driver_license: '787330',
            email: 'abome@regrog.ee',
            name: 'Leon Perkins',
            password: '1234',
        });

        await sendForgotPasswordMailUseCase.execute('abome@regrog.ee');

        expect(generateTokenMail).toBeCalled();
    });
});
