import { eq, inArray } from "drizzle-orm";
import { booksTable, booksToAuthorsTable } from "../../../db/schema";
import { DbAuthor } from "../../../db/types/author";
import { builder } from "../../builder";
import { GqlBook } from "../books/books";


export const GqlAuthor = builder.objectRef<DbAuthor>("Author");
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
  
        const bookIds = links.map(link => link.bookId);
  
        if (bookIds.length === 0) return [];
  
        return ctx.db
          .select()
          .from(booksTable)
          .where(inArray(booksTable.id, bookIds));
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
      return ctx.db.query.authorsTable.findFirst({
        where: (fields, { eq }) => eq(fields.id, args.id),
      });
    },
  }),

  authors: t.field({
    type: [GqlAuthor],
    resolve: async (parent, args, ctx) => {
      return ctx.db.query.authorsTable.findMany();
    },
  }),
}));
