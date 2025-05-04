import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { createYoga, useExecutionCancellation } from "graphql-yoga";
import { schema } from "./graphql/schema/";

export function buildApp(logging = true) {
  const app = fastify({ logger: true });

  const graphQLServer = createYoga<{
    req: FastifyRequest;
    reply: FastifyReply;
  }>({
    plugins: [useExecutionCancellation()],
    schema: schema,

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
