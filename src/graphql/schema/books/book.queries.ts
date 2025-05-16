import { builder } from "../../builder";
import { booksTable } from "../../../db/schema";
import { GqlBook } from "./book.type";

builder.queryFields((t) => ({
  book: t.field({
    type: GqlBook,
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: async (parent, args, ctx) => {
      return args.id;
    },
  }),

  books: t.field({
    type: [GqlBook],
    args: {
      limit: t.arg.int({ defaultValue: 10 }),
      offset: t.arg.int({ defaultValue: 0 }),
    },
    resolve: async (parent, { limit, offset }, ctx) => {
      const safeLimit = limit ?? 10;
      const safeOffset = offset ?? 0;
      const books = await ctx.db
        .select()
        .from(booksTable)
        .limit(safeLimit)
        .offset(safeOffset);
      return books.map((b) => b.id);
    },
  }),
}));