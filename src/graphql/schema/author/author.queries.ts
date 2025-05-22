import { builder } from "../../builder";
import { GqlAuthor } from "./author.type";

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
      return args.ids.map((id) => Number(id)); 
    },
  }),
}));
