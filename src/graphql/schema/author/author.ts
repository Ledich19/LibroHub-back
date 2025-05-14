import { eq, inArray } from "drizzle-orm";
import {
  authorsTable,
  booksToAuthorsTable,
} from "../../../db/schema";
import { DbAuthor } from "../../../db/types/author";
import { builder } from "../../builder";
import { GqlBook } from "../books/books";

export const GqlAuthor = builder.loadableObjectRef<DbAuthor, number>("Author", {
  load: async (ids: number[], ctx): Promise<readonly (DbAuthor | Error)[]> => {
    console.log("📦 Loading authors loader works: ", ids);
    const authors = (await ctx.db
      .select()
      .from(authorsTable)
      .where(inArray(authorsTable.id, ids))) as DbAuthor[];
    const authorMap = new Map(
      authors.map((author: DbAuthor) => [author.id, author])
    );
    return ids.map(
      (id) => authorMap.get(id) || new Error(`Author not found: ${id}`)
    );
  },
});
GqlAuthor.implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    firstNames: t.exposeString("firstName"),
    lastName: t.exposeString("lastName"),
    slug: t.exposeString("slug"),
    photoUrl: t.exposeString("photoUrl"),
    birthDate: t.expose("birthDate", { type: "Date" }),
    deathDate: t.expose("deathDate", { type: "Date" }),
    status: t.exposeString("status"),
    gender: t.exposeString("gender"),
    country: t.exposeString("country"),
    language: t.exposeString("language"),
    twitter: t.exposeString("twitter"),
    facebook: t.exposeString("facebook"),
    instagram: t.exposeString("instagram"),
    linkedin: t.exposeString("linkedin"),
    email: t.exposeString("email"),
    createdAt: t.expose("createdAt", { type: "Date" }),
    updatedAt: t.expose("updatedAt", { type: "Date" }),

    books: t.field({
      type: [GqlBook],
      resolve: async (author, args, ctx) => {
        const links = await ctx.db
          .select()
          .from(booksToAuthorsTable)
          .where(eq(booksToAuthorsTable.authorId, author.id));

        const bookIds = links.map((link) => link.bookId);

        if (bookIds.length === 0) return [];

        return bookIds;
      },
    }),
  }),
});

builder.queryFields((t) => ({
  author: t.field({
    type: GqlAuthor,
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: async (parent, args, ctx) => {
      return args.id; // ✅ вернуть только id
    },
  }),

  authors: t.field({
    type: [GqlAuthor],
    args: {
      ids: t.arg.stringList({ required: true }),
    },
    resolve: async (parent, args, ctx) => {
      return args.ids.map((id) => Number(id)); // ✅ вернуть массив id
    },
  }),
}));
