import container, { Dependencies } from '../../../container';

const healthController = container.resolve('healthController') as Dependencies['healthController'];

export = healthController;
