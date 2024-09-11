import { version } from '../../../package.json';
import config from '../../config';
import { Dependencies } from '../../container';
import APIResponse from '../adapters/server/response.model';
import { requestHandler } from '../adapters/server/server.adapter';
import { ServiceOk } from './apiResponses';

export default ({ logger, dbAdapter, axios }: Dependencies) => {
  return {
    healthCheck: requestHandler(async req => {
      const health = {
        db: false,
        connectivity: false,
      };
        
      try {
        await dbAdapter.query({ sql: 'SELECT 1' });
        health.db = true;
      } catch (error) {
        logger.error({ error }, 'Error connecting to the Alpaca database');
      }

      try {
        await axios.get('http://www.google.com');
        health.connectivity = true;
      } catch (error) {
        logger.error({ error }, 'Error with internet connectivity');
      }
        
      return new APIResponse(ServiceOk, req, { data: {
        ...config.SERVER,
        version,
        health,
        deployment: config.DEPLOYMENT_INFO,
      } });
    }),
  };
};
