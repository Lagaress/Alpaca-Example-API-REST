import path from 'path';
import config from './src/config';
import container, { Dependencies } from './src/container';
import apiDefinition from './src/infrastructure/api/definition';

const serverAdapter = container.resolve('serverAdapter') as Dependencies['serverAdapter'];

async function start() {
  serverAdapter({
    port: config.SERVER.PORT,
    host: config.SERVER.HOST,
    apiDefinition,
    controllersPath: path.join(__dirname, './src/infrastructure/api/entrypoints'),
  });
}

start();
