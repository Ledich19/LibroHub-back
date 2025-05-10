import jwt from "jsonwebtoken";
import { builder } from "../../builder";
import { compare, hash } from "bcryptjs";
import db from "../../../db";
import { usersTable } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { GqlUser } from "../user/user";
import { DbUser } from "../../../db/types/user";

const JWT_SECRET = process.env.JWT_SECRET ?? "secret";

const AuthPayload = builder
  .objectRef<{
    token: string | null;
    user: DbUser;
  }>("AuthPayload")
  .implement({
    fields: (t) => ({
      token: t.exposeString("token", { nullable: true }),
      user: t.expose("user", {
        type: GqlUser,
      }),
    }),
  });

builder.mutationFields((t) => ({
  signup: t.field({
    type: AuthPayload,
    args: {
      email: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
      name: t.arg.string({ required: true }),
    },
    resolve: async (_, args) => {
      const hashedPassword = await hash(args.password, 10);

      const user: typeof usersTable.$inferInsert = {
        name: args.name,
        email: args.email,
        passwordHash: hashedPassword,
      };

      const [createdUser] = await db
        .insert(usersTable)
        .values(user)
        .returning();

      const token = jwt.sign({ userId: createdUser.id }, JWT_SECRET);
      return { token, user: createdUser };
    },
  }),

  login: t.field({
    type: AuthPayload,
    args: {
      email: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
    },

    resolve: async (_, { email, password }) => {
      const user = await db.query.usersTable.findFirst({
        where: eq(usersTable.email, email),
      });

      if (!user) throw new Error("User not found");

      const valid = await compare(password, user.passwordHash);
      if (!valid) throw new Error("Invalid password");

      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      return { token, user };
    },
  }),
}));
