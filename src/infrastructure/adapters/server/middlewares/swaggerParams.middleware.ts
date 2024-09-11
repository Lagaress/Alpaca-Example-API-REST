import { ServerRequest } from '../server.adapter';

export default (req: ServerRequest, _res, next) => {
  if (!req.swagger) {
    return next();
  }
  const paramExpressMapper = {
    path: 'params',
  };
  for (const parameter of Object.values(req.swagger.params)) {
    const expressParameter = paramExpressMapper[parameter.schema.in] || parameter.schema.in;
    if (!req[expressParameter]) {
      req[expressParameter] = {};
    }
    if (parameter.schema.in === 'body') {
      req[expressParameter] = parameter.value;
      continue;
    }
    req[expressParameter][parameter.schema.name] = parameter.value;
  }
  next();
};
