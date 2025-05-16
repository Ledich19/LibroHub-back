import { builder } from "../../builder";
import { seriesTable } from "../../../db/schema";
import { GqlSeries } from "./series.type";


builder.queryFields((t) => ({
  series: t.field({
    type: GqlSeries,
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: async (parent, args, ctx) => {
      return args.id;
    },
  }),

  serieses: t.field({
    type: [GqlSeries],
    args: {
      limit: t.arg.int({ defaultValue: 10 }),
      offset: t.arg.int({ defaultValue: 0 }),
    },
    resolve: async (parent, { limit, offset }, ctx) => {
      const safeLimit = limit ?? 10;
      const safeOffset = offset ?? 0;
      const rows = await ctx.db
        .select()
        .from(seriesTable)
        .limit(safeLimit)
        .offset(safeOffset);

      return rows.map((row) => row.id);
    },
  }),
}));
