import { DbAuthor } from "../../../db/types/author";
import { builder } from "../../builder";
import { GqlBook } from "../books";
import { authorsLoader, booksByAuthorLoader } from "./author.loader";

export const GqlAuthor = builder.loadableObjectRef<DbAuthor, number>("Author", {
  load: authorsLoader,
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
    languageCode: t.exposeString("languageCode"),
    twitter: t.exposeString("twitter"),
    facebook: t.exposeString("facebook"),
    instagram: t.exposeString("instagram"),
    linkedin: t.exposeString("linkedin"),
    email: t.exposeString("email"),
    createdAt: t.expose("createdAt", { type: "Date" }),
    updatedAt: t.expose("updatedAt", { type: "Date" }),

    books: t.loadableList({
      type: GqlBook,
      nullable: true,
      load: booksByAuthorLoader,
      resolve: async (author, args, ctx) => {
        return author.id;
      },
    }),
  }),
});
