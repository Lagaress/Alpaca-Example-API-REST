import UserRepositoryInterface from '../../src/usecases/abstractions/userRepository.interface';
import Mocked = jest.Mocked;

const userRepositoryStub: Mocked<UserRepositoryInterface> = {
  create: jest.fn(),
  getAll: jest.fn(),
  get: jest.fn(),
  update: jest.fn(),
  count: jest.fn(),
  delete: jest.fn(),
};

export default userRepositoryStub;
