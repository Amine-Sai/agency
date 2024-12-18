import { ApolloServer } from "apollo-server";
import typeDefs from "./graphql/schema";
import resolvers from "./graphql/resolvers/index";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (err) => {
    return {
      message: err.message,
      code: err.extensions.code || "INTERNAL_SERVER_ERROR",
      context: ({ req }: { req: any }) => {
        return {
          prisma, // Attach the Prisma client to the context
          user: req.user, // Example: Add authenticated user from the request, if applicable
        };
      },
      details: err.extensions.details || null,
    };
  },
});

const PORT = 4000;
server.listen(PORT).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
