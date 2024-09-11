import { Dependencies } from '../../container';
import { UserAlreadyExists } from '../../domain/primitives/exceptions';
import User from '../../domain/User/User';
import { UserFilter } from '../abstractions/userRepository.interface';
import { EntityPagination } from '../types/queryParams.types';
import userModel, { paginatedUserModel, UserOutput, UserPaginatedOutput } from './outputModels/user.model';

export type UserCreationPayload = Pick<User, 'nickname' | 'email' | 'password'>;
export type UserUpdationPayload = Partial<Pick<User, 'nickname' | 'email'>>;

export default ({
  logger,
  userService,
  userRepository,
}: Dependencies) => {
  return {
    async create(payload: UserCreationPayload): Promise<UserOutput> {
      const childLog = logger.child({ email: payload.email });
      childLog.debug('Creating user');

      const existingUser = await userRepository.getAll({ email: payload.email });
      if (existingUser.length > 0) {
        childLog.warn('User already exists');
        throw UserAlreadyExists;
      }

      const user = await userRepository.create(new User({
        ...payload,
      }));
      childLog.debug('User created successfully');
      return userModel(user);
    },

    async get(userId: number): Promise<UserOutput> {
      const childLog = logger.child({ userId });
      childLog.debug('Getting an user');

      const user = await userService.getOrFail(userId);

      childLog.debug('User retrieved successfully');
      return userModel(user);
    },

    async getAll(
      filter: UserFilter = {},
      paginatedParams?: EntityPagination
    ): Promise<UserPaginatedOutput> {
      const childLog = logger.child({ filter, paginatedParams });
      childLog.debug('Getting users');
      const [ users, total ] = await Promise.all([
        userRepository.getAll(filter, paginatedParams),
        userRepository.count(filter),
      ]);

      childLog.debug('Users retrieved successfully');
      return paginatedUserModel(users, total);
    },

    async update(userId: number, payload: UserUpdationPayload): Promise<void> {
      const childLog = logger.child({ userId });
      childLog.debug('Updating user');
      const user = await userService.getOrFail(userId);
      user.update(payload);
      await userRepository.update(user);
      childLog.debug('User updated successfully');
    },

    async delete(userId: number): Promise<void> {
      const childLog = logger.child({ userId });
      childLog.debug('Deleting user');
      const user = await userRepository.get(userId);
      if (user) {
        await userRepository.delete(user.id);
      }
      childLog.debug('User deleted successfully');
    },
  };
};
