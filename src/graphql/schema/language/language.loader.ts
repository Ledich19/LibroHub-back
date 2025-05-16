import { DbLanguage } from "../../../db/types/ language";
import { Context } from "../../types";

export const languageLoader = async (
  codes: string[],
  ctx: Context
): Promise<readonly (DbLanguage | Error)[]> => {
  console.log("📦 Loading languages in batch:", codes);
  const languages = await ctx.db.query.languagesTable.findMany({
    where: (fields, { inArray }) => inArray(fields.code, codes),
  });
  const languageMap = new Map(languages.map((lang) => [lang.code, lang]));
  console.log(languageMap);

  return codes.map(
    (code) => languageMap.get(code) || new Error(`Language not found: ${code}`)
  );
};
