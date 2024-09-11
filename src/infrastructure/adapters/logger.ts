import { Dependencies } from '../../container';
import config from '../../config';
import LoggerInterface from '../../domain/primitives/logger.interface';

export default ({ pino }: Dependencies): LoggerInterface => pino({
  level: config.LOG_LEVEL,
  serializers: { err: pino.stdSerializers.err, error: pino.stdSerializers.err },
});
