import { ApolloServer } from "apollo-server";
import typeDefs from "./graphql/schema";
import resolvers from "./graphql/resolvers/index";
import { PrismaClient } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";

import * as dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();
const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({
    prisma,
    pubsub,
  }),
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
});
