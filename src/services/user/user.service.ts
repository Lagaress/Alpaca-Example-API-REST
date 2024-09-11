import { Dependencies } from '../../container';
import { UserNotFound } from '../../domain/primitives/exceptions';
import User from '../../domain/User/User';

export default ({
  logger,
  userRepository,
}: Dependencies) => {
  return {
    async getOrFail(userId: number): Promise<User> {
      const childLog = logger.child({ userId });
      childLog.debug('Getting user');
      const user = await userRepository.get(userId);
      if (!user) {
        childLog.warn('User not found');
        throw UserNotFound;
      }
      childLog.debug('User found');
      return user;
    },
  };
};
