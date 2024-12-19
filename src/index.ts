import express from "express";
import rateLimit from "express-rate-limit";
import { ApolloServer } from "apollo-server-express";
import typeDefs from "./graphql/schema";
import resolvers from "./graphql/resolvers/index";
import { PrismaClient } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";
import { authMiddleware } from "./middleware/authMiddleware";

import * as dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();
const pubsub = new PubSub();
const app = express();

// Set up rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const auth = authMiddleware({ req });
    return {
      prisma, // Attach the Prisma client to the context
      pubsub,
      user: auth,
    };
  },
});
const startServer = async () => {
  await server.start();
  server.applyMiddleware({ app });

  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(
      `Server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
};
startServer().catch((error) => {
  console.error("Error starting the server:", error);
});
