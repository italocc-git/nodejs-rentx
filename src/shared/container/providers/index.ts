import { container } from 'tsyringe';

import { IMailProvider } from './MailProvider/IMailProvider';
import { EtherealMailProvider } from './MailProvider/implementations/EtherealMailProvider';
import { IDateProvider } from './DateProvider/IDateProvider';
import { DayjsDateProvider } from './DateProvider/implementations/DayjsDateProvider';

container.registerSingleton<IDateProvider>(
    'DayjsDateProvider',
    DayjsDateProvider,
);

container.registerInstance<IMailProvider>(
    'EtherealMailProvider',
    new EtherealMailProvider(),
);
