import { UserAlreadyExists, UserNotFound } from "../../src/domain/primitives/exceptions";
import { UserFilter } from "../../src/usecases/abstractions/userRepository.interface";
import { EntityPagination } from "../../src/usecases/types/queryParams.types";
import { UserCreationPayload, UserUpdationPayload } from "../../src/usecases/user/user.usecases";
import { UserBuilder } from "../builders/user.builder";
import userRepositoryStub from "../stubs/user.repository.stub";
import container from "../test.container";

const { get, getAll, create, update, delete: deleteUser } = container.resolve('userUsecases');

describe('User Usecases', () => {
  const user = new UserBuilder().build();

  describe('Create', () => {
    const payload: UserCreationPayload = {
      email: 'test@test.com',
      nickname: 'test',
      password: 'test',
    };
    const newUser = new UserBuilder()
      .with('email', 'test@test.com')
      .with('nickname', 'test')
      .with('password', 'test')
      .build();

    beforeEach(async () => {
      userRepositoryStub.create.mockReset().mockResolvedValueOnce(newUser);
      userRepositoryStub.getAll.mockReset().mockResolvedValueOnce([]);
    });

    it('should retrieve the existing user from the repository', async () => {
      await create(payload);
      expect(userRepositoryStub.create).toHaveBeenCalledTimes(1);
      expect(userRepositoryStub.getAll).toHaveBeenCalledWith({ email: payload.email });
    });

    it('should fail if the user already exists', async () => {
      userRepositoryStub.getAll.mockResolvedValueOnce([user]);
      try {
        await create(payload);
      } catch (error) {
        expect(error).toBe(UserAlreadyExists);
      }
    });

    it('should create the user if it does not exist', async () => {
      await create(payload);
      expect(userRepositoryStub.create).toHaveBeenCalledTimes(1);
      expect(userRepositoryStub.create).toHaveBeenCalledWith(expect.objectContaining({
        email: payload.email,
        nickname: payload.nickname,
        password: payload.password,
      }));
    });

    it('should model it properly', async () => {
      const user = await create(payload);
      expect(user).toMatchSnapshot();
    });
  });

  describe('Get', () => {
    const userId = user.id;

    beforeEach(() => {
      userRepositoryStub.get.mockReset().mockResolvedValueOnce(user);
    });

    it('should retrieve the user from the repository', async () => {
      await get(userId);
      expect(userRepositoryStub.get).toHaveBeenCalledTimes(1);
      expect(userRepositoryStub.get).toHaveBeenCalledWith(userId);
    });

    it('should fail if the user does not exist', async () => {
      userRepositoryStub.get.mockReset().mockResolvedValueOnce(null);
      try {
        await get(userId);
      } catch (error) {
        expect(error).toBe(UserNotFound);
      }
    });

    it('should model it properly', async () => {
      const user = await get(userId);
      expect(user).toMatchSnapshot();
    });
  });

  describe('Get All', () => {
    const filter: UserFilter = {
      nickname: 'test',
    };
    const paginationParams: EntityPagination = {
      limit: 10,
      offset: 0,
    };

    const users = [user];

    beforeEach(() => {
      userRepositoryStub.getAll.mockReset().mockResolvedValueOnce(users);
      userRepositoryStub.count.mockReset().mockResolvedValueOnce(users.length);
    });
    
    it('should retrieve all users from the repository', async () => {
      await getAll(filter, paginationParams);
      expect(userRepositoryStub.getAll).toHaveBeenCalledTimes(1);
      expect(userRepositoryStub.getAll).toHaveBeenCalledWith(filter, paginationParams);
    });

    it('should count the total number of users', async () => {
      await getAll(filter, paginationParams);
      expect(userRepositoryStub.count).toHaveBeenCalledTimes(1);
      expect(userRepositoryStub.count).toHaveBeenCalledWith(filter);
    });

    it('should model it properly', async () => {
      const users = await getAll(filter, paginationParams);
      expect(users).toMatchSnapshot();
    });
  });

  describe('Update', () => {
    const userId = user.id;
    const payload: UserUpdationPayload = {
      email: 'test@test.com',
      nickname: 'test',
    };

    beforeEach(() => {
      userRepositoryStub.get.mockReset().mockResolvedValueOnce(user);
      userRepositoryStub.update.mockReset().mockResolvedValueOnce();
    });

    it('should retrieve the user from the repository', async () => {
      await update(userId, payload);
      expect(userRepositoryStub.get).toHaveBeenCalledTimes(1);
      expect(userRepositoryStub.get).toHaveBeenCalledWith(userId);
    });

    it('should fail if the user does not exist', async () => {
      userRepositoryStub.get.mockReset().mockResolvedValueOnce(null);
      try {
        await update(userId, payload);
      } catch (error) {
        expect(error).toBe(UserNotFound);
      }
    });

    it('should update the user', async () => {
      await update(userId, payload);
      expect(userRepositoryStub.update).toHaveBeenCalledTimes(1);
      expect(userRepositoryStub.update).toHaveBeenCalledWith(expect.objectContaining({
        id: userId,
        email: payload.email,
        nickname: payload.nickname,
      }));
    });
  });

  describe('Delete', () => {
    const userId = user.id;

    beforeEach(() => {
      userRepositoryStub.get.mockReset().mockResolvedValueOnce(user);
      userRepositoryStub.delete.mockReset();
    });

    it('should retrieve the user from the repository', async () => {
      await deleteUser(userId);
      expect(userRepositoryStub.get).toHaveBeenCalledTimes(1);
      expect(userRepositoryStub.get).toHaveBeenCalledWith(userId);
    });

    it('should delete the user', async () => {
      await deleteUser(userId);
      expect(userRepositoryStub.delete).toHaveBeenCalledTimes(1);
      expect(userRepositoryStub.delete).toHaveBeenCalledWith(userId);
    });

    it('should do nothing if the user does not exist', async () => {
      userRepositoryStub.get.mockReset().mockResolvedValueOnce(null);
      await deleteUser(userId);
      expect(userRepositoryStub.delete).not.toHaveBeenCalled();
    });
  }); 
});