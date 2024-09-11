import { ServerRequest } from '../server.adapter';

export function getParams<T>(req: ServerRequest): T {
  const queryParams: Record<string, { value: unknown }> = req.swagger?.params;
  const modelParams = {};
  for (const param in queryParams) {
    modelParams[param] = queryParams[param].value;
  }
  return modelParams as T;
}
