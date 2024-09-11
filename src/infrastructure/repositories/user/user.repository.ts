import { Knex } from 'knex';
import config from '../../../config';
import { Dependencies } from '../../../container';
import User from '../../../domain/User/User';
import Time from '../../../domain/primitives/Time';
import UserRepositoryInterface, { UserFilter } from '../../../usecases/abstractions/userRepository.interface';
import { EntityPagination } from '../../../usecases/types/queryParams.types';

const TABLE_NAME = 'user';
const tablesConfig = config.TABLES;
type UserRestore = {
  [TABLE_NAME]: DbUser
}

export type DbUser = {
  id: number;
  email: string;
  nickname: string;
  password: string;
  created_at: string;
  updated_at: string;
};

export default ({ dbAdapter }: Dependencies): UserRepositoryInterface => {
  function baseQuery(filter: UserFilter = {}, paginationParams?: EntityPagination,) {
    const queryBuilder = dbAdapter
      .db(`${tablesConfig.USER} as ${TABLE_NAME}`)
      .options({ nestTables: true });

    addFilter(queryBuilder, filter);
    addPagination(queryBuilder, paginationParams);
  
    return queryBuilder;
  }

  function addFilter(query: Knex.QueryBuilder, filter: UserFilter) {
    if (filter.userId) {
      query.where(`${TABLE_NAME}.id`, filter.userId);
    }

    if (filter.email) {
      query.where(`${TABLE_NAME}.email`, filter.email);
    }

    if (filter.nickname) {
      query.where(`${TABLE_NAME}.nickname`, filter.nickname);
    }
  }

  function addPagination(query: Knex.QueryBuilder, paginationParams?: EntityPagination) {
    if (paginationParams) {
      query.limit(paginationParams.limit).offset(paginationParams.offset);
    }
  }
  
  return {
    async create(user) {
      const [ id ] = await dbAdapter.db(config.TABLES.USER)
        .insert(adapt(user), [ 'id' ]);
      user.id = id;
      return user;
    },

    async get(userId) {
      const user = await baseQuery({ userId }).first();
      return user ? restore(user) : null;
    },

    async getAll(filter = {}, paginationParams) {
      const query = baseQuery(filter, paginationParams);
      const users = await query;
      return users.map(restore);
    },

    async update(user) {
      await dbAdapter.db(tablesConfig.USER).where('id', user.id).update(adapt(user));
    },

    async delete(userId) {
      await dbAdapter.db(tablesConfig.USER).where('id', userId).del();
    },

    async count(filter = {}) {
      const query = baseQuery(filter).options({ nestTables: false });
      const [ { total } ] = await query.countDistinct<{ total: number }[]>({
        total: `${TABLE_NAME}.id`,
      });
      return total;
    },
  };
};

function adapt(user: User): DbUser {
  return {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    password: user.password,
    created_at: user.createdAt.format(),
    updated_at: user.updatedAt.format(),
  };
}

export function restore(dbUser: UserRestore): User {
  const userRow = dbUser[TABLE_NAME];
  return new User({
    id: userRow.id,
    email: userRow.email,
    nickname: userRow.nickname,
    password: userRow.password,
    createdAt: Time.fromString(userRow.created_at),
    updatedAt: Time.fromString(userRow.updated_at),
  });
}
