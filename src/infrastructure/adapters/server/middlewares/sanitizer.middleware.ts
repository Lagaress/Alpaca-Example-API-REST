import sanitizeHtml from 'sanitize-html';
import { ServerRequest } from '../server.adapter';

function htmlSanitize(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [ 'strong', 'em', 'a', 'p', 'ul', 'ol', 'li', 'br' ],
    allowedAttributes: {
      a: [ 'href' ],
    },
    allowedSchemes: [ 'http', 'https' ],
    allowProtocolRelative: false,
  });
}

function sanitizePayloadWithSchema(schema, payload) {
  if (schema.allOf && Array.isArray(schema.allOf)) {
    return schema.allOf.forEach(schema => sanitizePayloadWithSchema(schema, payload));
  }

  const schemaProperties = schema.properties ?? schema.items ?? {};
  Object.keys(schemaProperties).forEach(property => {
    if (schemaProperties[property]?.properties) {
      sanitizePayloadWithSchema(schemaProperties[property], payload[property] ?? {});
    }
    if (schemaProperties[property]?.items) {
      (payload[property] ?? []).forEach(propertyValue => {
        sanitizePayloadWithSchema(schemaProperties[property], propertyValue);
      });
    }
  });

  const fieldsToSanitize = Object.keys(schemaProperties).filter(property => schemaProperties[property]?.['x-format'] === 'html');
  for (const attribute of fieldsToSanitize) {
    if (typeof payload[attribute] === 'string') {
      payload[attribute] = htmlSanitize(payload[attribute]);
    }
  }
}

function sanitizeSwaggerParams(swaggerParams) {
  const fieldsToSanitize = Object.keys(swaggerParams).filter(property => swaggerParams[property].schema?.['x-format'] === 'html');
  for (const attribute of fieldsToSanitize) {
    const param = swaggerParams[attribute];
    if (typeof param.value === 'string') {
      param.value = htmlSanitize(param.value);
    }
  }
}

export default (req: ServerRequest, _res, next) => {
  const swaggerParams = req.swagger?.params;
  const baseSchema = swaggerParams?.data?.schema as unknown as { schema: Record<string, unknown> };
  const schema = baseSchema?.schema;

  if (swaggerParams) {
    try {
      sanitizeSwaggerParams(swaggerParams);
    } catch (error) {
      req.logger.fatal({ error }, 'Unhandled error sanitizing payload (swagger params)');
    }
  }
  if (schema) {
    try {
      sanitizePayloadWithSchema(schema, req.body);
    } catch (error) {
      req.logger.fatal({ error }, 'Unhandled error sanitizing payload (payload with schema)');
    }
  }

  next();
};
