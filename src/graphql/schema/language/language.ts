import { DbLanguage } from "../../../db/types/ language";
import { builder } from "../../builder";

export const GqlLanguage = builder.loadableObjectRef<DbLanguage, string>(
  "language",
  {
    load: async (
      codes: string[],
      ctx
    ): Promise<readonly (DbLanguage | Error)[]> => {
      ctx.log.debug("📦 Loading languages in batch:", codes);

      const languages = await ctx.db.query.languagesTable.findMany({
        where: (fields, { inArray }) => inArray(fields.code, codes),
      });

      const languageMap = new Map(
        languages.map((language: DbLanguage) => [language.code, language])
      );

      return codes.map(
        (code) => languageMap.get(code) || new Error(`Language not found: ${code}`)
      );
    },
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
