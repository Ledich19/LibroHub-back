import { builder } from "../../builder";
import { DbUser } from "../../../db/types/user";
import db from "../../../db";
import { usersTable } from "../../../db/schema";
import { eq } from "drizzle-orm";

export const GqlUser = builder.objectRef<Omit<DbUser, "passwordHash">>("User");
GqlUser.implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    email: t.exposeString("email"),
    name: t.exposeString("name"),
    createdAt: t.expose("createdAt", { type: "Date" }),
    updatedAt: t.expose("updatedAt", { type: "Date" }),
  }),
});

builder.queryField("me", (t) =>
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
