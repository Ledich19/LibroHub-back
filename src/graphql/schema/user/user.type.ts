import { DbUser } from "../../../db/types/user";
import { builder } from "../../builder";

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
