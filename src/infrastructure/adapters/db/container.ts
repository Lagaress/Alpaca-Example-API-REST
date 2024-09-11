import { AwilixContainer, asValue, createContainer, asFunction } from 'awilix';
import mysql2 from 'mysql2';
import knex from 'knex';

import dbAdapter from './db.adapter';

const container: AwilixContainer = createContainer();

container.register({
  mysql2: asValue(mysql2),
  knex: asValue(knex),
  dbAdapter: asFunction(dbAdapter).singleton(),
});

export default container;

export type Dependencies = {
  // Libraries
  mysql2: typeof mysql2;
  knex: typeof knex;

  // adapter
  dbAdapter: ReturnType<typeof dbAdapter>;
};
