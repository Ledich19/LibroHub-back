import { builder } from "../builder";

builder.queryFields((t) => ({
  hello: t.string({
    args: {
      name: t.arg.string(),
    },
    resolve: (_, { name }) => `Hello, ${name || "World"}`,
  }),
}));

// Mutation (пример)
builder.mutationFields((t) => ({
  updateHello: t.string({
    args: {
      newName: t.arg.string({ required: true }),
    },
    
    resolve: (_, { newName }) => `Updated to: ${newName}`,
  }),
}));
