import { asValue, AwilixContainer, createContainer } from 'awilix';

import baseContainer from './../src/container';
import userRepositoryStub from './stubs/user.repository.stub';

const container: AwilixContainer = createContainer();

container.register({
  ...baseContainer.registrations,

  // Repositories
  userRepository: asValue(userRepositoryStub),
});

export default container;
