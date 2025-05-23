import { eq } from "drizzle-orm";
import { usersTable } from "../../../db/schema";
import { builder } from "../../builder";
import { GqlUser } from "./user.type";


builder.queryField("viewer", (t) =>
  t.field({
    type: GqlUser,
    nullable: true,
    description: "Get the current authenticated user",
    authScopes: { loggedIn: true },
    
    resolve: async (_, __, ctx) => {
      if (!ctx.userId) return null;
      const [user] = await ctx.db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, ctx.userId))
        .limit(1);
      return user || null;
    },
  })
);

builder.queryField("user", (t) =>
  t.field({
    type: GqlUser,
    nullable: true,
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: async (_, { id }, ctx) => {
      const [user] = await ctx.db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, id))
        .limit(1);
      return user || null;
    },
  })
);