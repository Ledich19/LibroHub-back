import { FastifyReply, FastifyRequest } from "fastify";

export interface GraphQLContext {
  req: FastifyRequest;
  reply: FastifyReply;
}