import jwt from "jsonwebtoken";
import { builder, prisma } from "../../builder";
import { User } from "../../../generated/prisma";
import { compare, hash } from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

// --- Типы ---
const UserObject = builder.prismaObject("User", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    email: t.exposeString("email"),
    links: t.relation("links"),
  }),
});

builder.prismaObject("Link", {
  fields: (t) => ({
    id: t.exposeID("id"),
    description: t.exposeString("description"),
    url: t.exposeString("url"),
    postedBy: t.relation("postedBy"),
  }),
});

const AuthPayload = builder
  .objectRef<{
    token: string | null;
    user: User;
  }>("AuthPayload")
  .implement({
    fields: (t) => ({
      token: t.exposeString("token"),
      user: t.expose("user", {
        // type: builder.prismaObject("User", {})
        type: UserObject,
      }),
    }),
  });

// --- Query ---
builder.queryFields((t) => ({
 

  feed: t.prismaField({
    type: ["Link"],
    resolve: (query) => prisma.link.findMany({ ...query }),
  }),
}));

// --- Mutation ---
builder.mutationFields((t) => ({
  // post: t.prismaField({
  //   type: "Link",
  //   args: {
  //     url: t.arg.string({ required: true }),
  //     description: t.arg.string({ required: true }),
  //   },
  //   resolve: async (query, _, args, ctx) => {
  //     if (!ctx.userId) throw new Error("Not authenticated");
  //     return prisma.link.create({
  //       ...query,
  //       data: {
  //         url: args.url,
  //         description: args.description,
  //         userId: ctx.userId,
  //       },
  //     });
  //   },
  // }),

  signup: t.field({
    type: AuthPayload,
    args: {
      email: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
      name: t.arg.string({ required: true }),
    },
    resolve: async (_, args) => {
      const hashedPassword = await hash(args.password, 10);

      const user = await prisma.user.create({
        data: {
          email: args.email,
          name: args.name,
          passwordHash: hashedPassword,
        },
      });

      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      return { token, user };
    },
  }),

  login: t.field({
    type: AuthPayload,
    args: {
      email: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
    },
    resolve: async (_, { email, password }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error("User not found");

      const valid = await compare(password, user.passwordHash);
      if (!valid) throw new Error("Invalid password");

      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      return { token, user };
    },
  }),
}));
