import { Hono } from 'hono';
import { router } from './router';
import { CORSPlugin } from '@orpc/server/plugins';
import { ZodToJsonSchemaConverter } from '@orpc/zod';
import { OpenAPIGenerator } from '@orpc/openapi';
import { OpenAPIHandler } from '@orpc/openapi/fetch';
import { env } from 'bun';

const app = new Hono();

const openAPIHandler = new OpenAPIHandler(router, {
  plugins: [new CORSPlugin()],
});

const openAPIGenerator = new OpenAPIGenerator({
  schemaConverters: [new ZodToJsonSchemaConverter()],
});

const html = `
    <!doctype html>
    <html>
      <head>
        <title>My Client</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="https://orpc.unnoq.com/icon.svg" />
      </head>
      <body>
        <div id="app"></div>

        <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
        <script>
          Scalar.createApiReference('#app', {
            url: '/spec.json',
            authentication: {
              securitySchemes: {
                bearerAuth: {
                  token: 'default-token',
                },
              },
            },
          })
        </script>
      </body>
    </html>
  `;

app.use(async (c, next) => {
  const { matched, response } = await openAPIHandler.handle(c.req.raw, {
    prefix: '/rpc',
    context: {
      req: c.req,
    }, // Provide initial context if needed
  });

  if (matched) {
    return c.newResponse(response.body, response);
  }

  if (c.req.path === '/spec.json') {
    const spec = await openAPIGenerator.generate(router, {
      info: {
        title: 'Workflow Engine',
        version: '1.0.0',
      },
      servers: [{ url: '/rpc' } /** Should use absolute URLs in production */],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
          },
          apiKey: {
            type: 'apiKey',
            name: 'x-api-key',
            in: 'header',
          },
        },
      },
    });

    return c.json(spec, 200);
  }

  return c.html(html);
});

export default {
  fetch: app.fetch,
  port: env?.['PORT'] ?? 3000,
};
