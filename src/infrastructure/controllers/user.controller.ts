import { Dependencies } from '../../container';
import { UserFilter } from '../../usecases/abstractions/userRepository.interface';
import { EntityPagination } from '../../usecases/types/queryParams.types';
import { UserCreationPayload, UserUpdationPayload } from '../../usecases/user/user.usecases';
import { getParams } from '../adapters/server/model/params.model';
import APIResponse from '../adapters/server/response.model';
import { requestHandler } from '../adapters/server/server.adapter';
import { UserCreatedOk, UserDeletedOk, UserRetrievedOk, UsersRetrievedOk, UserUpdatedOk } from './apiResponses';

export default ({ userUsecases }: Dependencies) => {
  return {
    create: requestHandler(async req => {
      const { email, password, nickname } = getParams<UserCreationPayload>(req);
      const payload = { email, password, nickname } satisfies UserCreationPayload;
      const user = await userUsecases.create(payload);
      return new APIResponse(UserCreatedOk, req, { data: user });
    }),

    get: requestHandler(async req => {
      const { userId } = getParams<{ userId: number }>(req);
      const user = await userUsecases.get(userId);
      return new APIResponse(UserRetrievedOk, req, { data: user });
    }),

    getAll: requestHandler(async req => {
      const { nickname, email, ...paginationParams } = getParams<UserFilter & EntityPagination>(req);
      const filter = { nickname, email } satisfies UserFilter;
      const { users, total } = await userUsecases.getAll(filter, paginationParams);
      return new APIResponse(UsersRetrievedOk, req, {
        data: users,
        extra: {
          ...paginationParams,
          total,
        },
      });
    }),

    update: requestHandler(async req => {
      const { userId } = getParams<{ userId: number }>(req);
      const { email, nickname } = getParams<UserUpdationPayload>(req);
      const payload = { email, nickname } satisfies UserUpdationPayload;
      const user = await userUsecases.update(userId, payload);
      return new APIResponse(UserUpdatedOk, req, { data: user });
    }),

    delete: requestHandler(async req => {
      const { userId } = getParams<{ userId: number }>(req);
      await userUsecases.delete(userId);
      return new APIResponse(UserDeletedOk, req);
    }),
  };
};
