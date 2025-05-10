import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { createYoga, useExecutionCancellation } from "graphql-yoga";
import { schema } from "./graphql/schema/";
import { authMiddleware } from "./middleware/auth"; 
import db from "./db";
import { Context } from "./graphql/types";

export function buildApp(logging = true) {
  const app = fastify({
    logger: {
      level: 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
          messageFormat: '{level} {msg}',
        },
      },
    },
  });

  // Регистрируем middleware
  app.addHook("preHandler", authMiddleware);

  const graphQLServer = createYoga<{
    req: FastifyRequest;
    reply: FastifyReply;
  }>({
    plugins: [useExecutionCancellation()],
    schema: schema,
    context: async ({ req }) => {
      return {
        db,
        userId: req.userId,
      } as Context;
    },

    // Integrate Fastify Logger to Yoga
    logging: {
      debug: (...args) => {
        for (const arg of args) app.log.debug(arg);
      },
      info: (...args) => {
        for (const arg of args) app.log.info(arg);
      },
      warn: (...args) => {
        for (const arg of args) app.log.warn(arg);
      },
      error: (...args) => {
        for (const arg of args) app.log.error(arg);
      },
    },
  });

  app.addContentTypeParser("multipart/form-data", {}, (_req, _payload, done) =>
    done(null)
  );

  app.route({
    url: graphQLServer.graphqlEndpoint,
    method: ["GET", "POST", "OPTIONS"],
    handler: (req, reply) =>
      graphQLServer.handleNodeRequestAndResponse(req, reply, {
        req,
        reply,
      }),
  });

  return [app, graphQLServer.graphqlEndpoint] as const;
}
