import { sql } from "drizzle-orm";
import { booksTable } from "../../../db/schema";
import { builder } from "../../builder";

export const BOOK_FILTER_KEYS = {
  SEARCH: "search",
  GENRES: "genres",
  TAGS: "tags",
  AUTHORS: "authors",
  SERIES: "series",
  LANGUAGE: "language",
  RATING: "rating",
  PAGES: "pages",
  YEAR: "year",
  SORT_BY: "sort_by",
} as const;

export type BookFilterKey = typeof BOOK_FILTER_KEYS[keyof typeof BOOK_FILTER_KEYS];

export enum FilterType {
  SEARCH = "SEARCH",
  SELECT = "SELECT",
  RANGE = "RANGE",
}

export enum SortByType {
  NAME = "NAME",
  RATING = "RATING",
  YEAR = "YEAR",
}

export interface FilterOption<T> {
  label: string;
  value: T;
  count?: number;
  icon?: string;
}

export interface BaseFilter {
  name: string;
  type: FilterType;
}

export interface FilterSearch extends BaseFilter {
  type: FilterType.SEARCH;
  placeholder: string;
}

export interface FilterSelect extends BaseFilter {
  type: FilterType.SELECT;
  options: FilterOption<string | number>[];
  isSearchable?: boolean;
  isMulti?: boolean;
}

export interface FilterRange extends BaseFilter {
  type: FilterType.RANGE;
  min: number;
  max: number;
  presets?: string[];
}

export type Filter = FilterSearch | FilterSelect | FilterRange;

export const GqlFilterTypeEnum = builder.enumType("FilterType", {
  values: ["SEARCH", "SELECT", "RANGE"] as const,
});

export const GqlFilterOption = builder
  .objectRef<FilterOption<string | number | null>>("FilterOption")
  .implement({
    fields: (t) => ({
      label: t.exposeString("label", { nullable: false }),
      value: t.field({
        type: "String",
        nullable: false,
        resolve: (option) => option.value?.toString() ?? "",
      }),
    }),
  });

export const GqlFilterSearch = builder
  .objectRef<FilterSearch>("FilterSearch")
  .implement({
    fields: (t) => ({
      name: t.exposeString("name", { nullable: false }),
      type: t.field({
        type: GqlFilterTypeEnum,
        resolve: () => FilterType.SEARCH,
      }),
      placeholder: t.exposeString("placeholder", { nullable: false }),
    }),
  });

export const GqlFilterSelect = builder
  .objectRef<FilterSelect>("FilterSelect")
  .implement({
    fields: (t) => ({
      name: t.exposeString("name", { nullable: false }),
      type: t.field({
        type: GqlFilterTypeEnum,
        resolve: () => FilterType.SELECT,
      }),
      options: t.expose("options", {
        type: [GqlFilterOption],
        nullable: false,
      }),
      isSearchable: t.exposeBoolean("isSearchable", { nullable: true }),
      isMulti: t.exposeBoolean("isMulti", { nullable: true }),
    }),
  });

export const GqlFilterRange = builder
  .objectRef<FilterRange>("FilterRange")
  .implement({
    fields: (t) => ({
      name: t.exposeString("name", { nullable: false }),
      type: t.field({
        type: GqlFilterTypeEnum,
        resolve: () => FilterType.RANGE,
      }),
      min: t.exposeInt("min", { nullable: false }),
      max: t.exposeInt("max", { nullable: false }),
      presets: t.exposeStringList("presets", { nullable: true }),
    }),
  });

export const GqlFilter = builder.unionType("Filter", {
  types: [GqlFilterSearch, GqlFilterSelect, GqlFilterRange],
  resolveType: (filter: Filter) => {
    switch (filter.type) {
      case FilterType.SEARCH:
        return "FilterSearch";
      case FilterType.SELECT:
        return "FilterSelect";
      case FilterType.RANGE:
        return "FilterRange";
      default:
        throw new Error(`Unknown filter type: ${filter}`);
    }
  },
});



builder.queryField("booksFilters", (t) =>
  t.field({
    type: [GqlFilter],
    resolve: async (parent, args, ctx): Promise<Filter[]> => {
      // Выборка id и name из genresTable
      const genresList = await ctx.db.query.genresTable.findMany({
        columns: {
          id: true,
          name: true,
        },
        orderBy: (fields, { desc }) => desc(fields.name),
      });
      const genreOptions: FilterOption<number>[] = genresList.map((genre) => ({
        label: genre.name,
        value: genre.id,
      }));
      console.log(genreOptions);
      // Выборка id и name из seriesTable

      const seriesList = await ctx.db.query.seriesTable.findMany({
        columns: {
          id: true,
          title: true,
        },
        orderBy: (fields, { desc }) => desc(fields.title),
      });
      const seriesOptions: FilterOption<number>[] = seriesList.map(
        (series) => ({
          label: series.title,
          value: series.id,
        })
      );

      // Выборка id и name из tagsTable

      // Выборка id и name из authorsTable
      const authorsList = await ctx.db.query.authorsTable.findMany({
        columns: {
          id: true,
          firstName: true,
          middleName: true,
          lastName: true,
        },
        orderBy: (fields, { desc }) => desc(fields.firstName),
      });

      const authorOptions: FilterOption<number>[] = authorsList.map(
        (author) => ({
          label: `${author.firstName ?? ""} ${author.middleName ?? ""} ${
            author.lastName ?? ""
          }`,
          value: author.id,
        })
      );
      //  from languagesTable
      const languagesList = await ctx.db.query.languagesTable.findMany({
        columns: {
          code: true,
          name: true,
        },
        orderBy: (fields, { desc }) => desc(fields.code),
      });

      const languageOptions: FilterOption<string>[] = languagesList.map(
        (language) => ({
          label: language.name,
          value: language.code,
        })
      );
      // min max pages
      const ranges = await ctx.db
        .select({
          minPages: sql<number>`MIN(${booksTable.pageCount})`.as("min_pages"),
          maxPages: sql<number>`MAX(${booksTable.pageCount})`.as("max_pages"),
        })
        .from(booksTable);

      // min book earliest publish year
      const result = await ctx.db
        .select({
          minYear:
            sql<number>`EXTRACT(YEAR FROM MIN(${booksTable.publishedDate}))`.as(
              "min_year"
            ),
        })
        .from(booksTable);
      const minYear = result[0]?.minYear || 0;

      return [
        {
          name: BOOK_FILTER_KEYS.SEARCH,
          type: FilterType.SEARCH,
          placeholder: "Search by title or description...",
        },
        {
          name: BOOK_FILTER_KEYS.GENRES,
          type: FilterType.SELECT,
          options: genreOptions,
          isSearchable: true,
          isMulti: true,
        },
        {
          name: BOOK_FILTER_KEYS.TAGS,
          type: FilterType.SELECT,
          options: [],
          isSearchable: true,
        },
        {
          name: BOOK_FILTER_KEYS.AUTHORS,
          type: FilterType.SELECT,
          options: authorOptions,
          isSearchable: true,
          isMulti: true,
        },
        {
          name: BOOK_FILTER_KEYS.SERIES,
          type: FilterType.SELECT,
          options: [{ label: "No series", value: 0 }].concat(seriesOptions),
          isMulti: true,
        },
        {
          name: BOOK_FILTER_KEYS.LANGUAGE,
          type: FilterType.SELECT,
          options: languageOptions,
          isMulti: true,
        },
        {
          name: BOOK_FILTER_KEYS.RATING,
          type: FilterType.RANGE,
          min: 0,
          max: 5,
          presets: ["≥3", "≥4", "≥4.5"],
        },
        {
          name: BOOK_FILTER_KEYS.PAGES,
          type: FilterType.RANGE,
          min: ranges[0].minPages ?? 0,
          max: ranges[0].maxPages ?? 1000,
          presets: ["<200", "200–500", ">500"],
        },
        {
          name: BOOK_FILTER_KEYS.YEAR,
          type: FilterType.RANGE,
          min: minYear,
          max: new Date().getFullYear(),
          presets: ["Last 5 years", "Last 10 years"],
        },
        {
          name: BOOK_FILTER_KEYS.SORT_BY,
          type: FilterType.SELECT,
          isMulti: false,
          options: [
            { label: "Rating (High to Low)", value: "rating_desc" },
            { label: "Year (Newest First)", value: "year_desc" },
            { label: "Popularity", value: "popularity_desc" },
          ],
        },
      ];
    },
  })
);
