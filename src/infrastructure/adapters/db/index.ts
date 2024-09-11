import container, { Dependencies } from './container';

export default container.resolve('dbAdapter') as Dependencies['dbAdapter'];
