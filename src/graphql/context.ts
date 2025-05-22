import { FastifyReply, FastifyRequest } from "fastify";
import db from "../db";

export interface GraphQLContext {
  req: FastifyRequest;
  reply: FastifyReply;
  db: typeof db;
  userId?: number;
  log: any; 
}