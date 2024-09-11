import { AwilixContainer, Lifetime, asValue, createContainer } from 'awilix';

import axios from 'axios';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import knex from 'knex';
import mysql2 from 'mysql2';
import pino from 'pino';
import swaggerTools from 'swagger-tools';

import LoggerInterface from './domain/primitives/logger.interface';

import config from './config';
import { DbAdapterInterface } from './infrastructure/adapters/db/db.adapter';
import dbAdapter from './infrastructure/adapters/db/index';
import serverAdapter from './infrastructure/adapters/server/server.adapter';
import healthController from './infrastructure/controllers/health.controller';
import userController from './infrastructure/controllers/user.controller';
import userService from './services/user/user.service';
import UserRepositoryInterface from './usecases/abstractions/userRepository.interface';
import userUsecases from './usecases/user/user.usecases';

const container: AwilixContainer = createContainer();

container.loadModules(
  [
    `${__dirname}/**/*.usecases.{ts,js}`,
    `${__dirname}/**/*.adapter.{ts,js}`,
    `${__dirname}/**/*.facade.{ts,js}`,
    `${__dirname}/**/*.factory.{ts,js}`,
    `${__dirname}/**/logger.{ts,js}`,
    `${__dirname}/**/*.controller.{ts,js}`,
    `${__dirname}/**/*.middleware.{ts,js}`,
    `${__dirname}/**/*.routes.{ts,js}`,
    `${__dirname}/**/*.repository.{ts,js}`,
    `${__dirname}/**/*.service.{ts,js}`,
    `${__dirname}/**/*.handler.{ts,js}`,
    `${__dirname}/**/*.proxy.{ts,js}`,
  ],
  {
    formatName: 'camelCase',
    resolverOptions: {
      lifetime: Lifetime.SINGLETON,
    },
  }
);

container.register({
  express: asValue(express),
  swaggerTools: asValue(swaggerTools),
  pino: asValue(pino),
  axios: asValue(axios),
  mysql2: asValue(mysql2),
  knex: asValue(knex),
  cors: asValue(cors),
  helmet: asValue(helmet),
  dbAdapter: asValue(dbAdapter(config.DB)),
});

export default container;

export type Dependencies = {
  // Libraries
  express: typeof express;
  swaggerTools: typeof swaggerTools;
  pino: typeof pino;
  axios: typeof axios;
  mysql2: typeof mysql2;
  knex: typeof knex;
  cors: typeof cors;
  helmet: typeof helmet;

  // Definitions
  logger: LoggerInterface;

  // Adapters
  serverAdapter: ReturnType<typeof serverAdapter>;
  dbAdapter: DbAdapterInterface;

  // Controllers
  userController: ReturnType<typeof userController>;
  healthController: ReturnType<typeof healthController>;

  // Repositories
  userRepository: UserRepositoryInterface;

  // Usecases
  userUsecases: ReturnType<typeof userUsecases>;

  // Services
  userService: ReturnType<typeof userService>;
};
