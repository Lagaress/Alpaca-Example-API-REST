import User from '../../domain/User/User';
import { EntityPagination } from '../types/queryParams.types';

export type UserFilter = {
  userId?: number;
  email?: string;
  nickname?: string;
}

interface UserRepositoryInterface {
  create(user: User): Promise<User>;
  get(userId: number): Promise<User>;
  getAll(filter?: UserFilter, paginationParams?: EntityPagination): Promise<User[]>;
  update(user: User): Promise<void>;
  delete(userId: number): Promise<void>;
  count(filter?: UserFilter): Promise<number>;
}

export default UserRepositoryInterface;
