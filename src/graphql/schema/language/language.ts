import { DbLanguage } from "../../../db/types/ language";
import { builder } from "../../builder";


export const  GqlLanguage = builder.objectRef<DbLanguage>("language");
GqlLanguage.implement({
  fields: (t) => ({
    code: t.exposeString("code"),
    name: t.exposeString("name"),
    nativeName: t.exposeString("nativeName"),
    countryCode: t.exposeString("countryCode"),
  }),
});
