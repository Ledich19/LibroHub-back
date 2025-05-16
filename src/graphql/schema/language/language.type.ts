import { DbLanguage } from "../../../db/types/ language";
import { builder } from "../../builder";
import { languageLoader } from "./language.loader";

export const GqlLanguage = builder.loadableObjectRef<DbLanguage, string>(
  "language",
  {
    load: languageLoader,
  }
);

GqlLanguage.implement({
  fields: (t) => ({
    code: t.exposeString("code"),
    name: t.exposeString("name"),
    nativeName: t.exposeString("nativeName"),
    countryCode: t.exposeString("countryCode"),
  }),
});
