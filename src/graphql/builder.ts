import SchemaBuilder from "@pothos/core";
import { GraphQLDate } from "graphql-scalars";
import ScopeAuthPlugin from "@pothos/plugin-scope-auth";
import { Context } from "./types";
import DataloaderPlugin from '@pothos/plugin-dataloader';

type MyPerms = "readStuff" | "updateStuff" | "readArticle";

export const builder = new SchemaBuilder<{
  Scalars: {
    Date: { Input: Date; Output: Date };
  };
  AuthScopes: {
    loggedIn: boolean;
    public: boolean;
    employee: boolean;
    deferredScope: boolean;
    // customPerm: MyPerms;
  };
  Context: Context;
  
}>({
  plugins: [ScopeAuthPlugin,DataloaderPlugin],
  scopeAuth: {
    authorizeOnSubscribe: true,
    authScopes: async (ctx) => ({
      loggedIn: !!ctx.userId,
      
      public: !!ctx.userId,
      // eagerly evaluated scope
      employee: await !!ctx.userId,
      // evaluated when used
      deferredScope: () => !!ctx.userId,
      // scope loader with argument
      // customPerm: (perm) =>
      //   ctx.permissionService.hasPermission(ctx.userId, perm),
    }),
  },
});

builder.addScalarType("Date", GraphQLDate, {});
// Инициализация базовых типов
builder.queryType({});
builder.mutationType({});
