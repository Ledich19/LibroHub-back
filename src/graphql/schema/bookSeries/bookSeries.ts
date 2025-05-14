
import { DbBookSeries } from "../../../db/types/books_serias";
import { builder } from "../../builder";


export const  GqlBookSeries = builder.objectRef<DbBookSeries>("bookSeries");
GqlBookSeries.implement({
  fields: (t) => ({
    id: t.exposeID("id", {}),
    title: t.exposeString("title"),
  }),
});
