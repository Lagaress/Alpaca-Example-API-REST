import container, { Dependencies } from '../../../container';

const userController = container.resolve('userController') as Dependencies['userController'];

export = userController;
