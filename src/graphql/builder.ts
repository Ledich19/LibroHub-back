
import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import { PrismaClient } from "../generated/prisma";

export const prisma = new PrismaClient();

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
    exposeDescriptions: {
      models: true,
      fields: true,
    },
    onUnusedQuery: process.env.MODE === "development" ? "warn" : null,
  },
});

// Инициализация базовых типов
builder.queryType({});
builder.mutationType({});
