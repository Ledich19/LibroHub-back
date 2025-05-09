import SchemaBuilder from "@pothos/core";
import { GraphQLDate } from "graphql-scalars";

// declare global {
//   interface PothosSchemaTypes extends SchemaTypes {
//     Scalars: SchemaTypes["Scalars"] & {
//       Date: {
//         Input: Date;
//         Output: Date;
//       };
//     };
//   }
// }

export const builder = new SchemaBuilder<{
  Scalars: {
    Date: { Input: Date; Output: Date };
    // String: { Input: string; Output: string };
    // ID: { Input: string | number; Output: string | number };
    // Int: { Input: number; Output: number };
    // Float: { Input: number; Output: number };
    // Boolean: { Input: boolean; Output: boolean };
  };
}>({
  plugins: [],
});

builder.addScalarType("Date", GraphQLDate, {});
// Инициализация базовых типов
builder.queryType({});
builder.mutationType({});
