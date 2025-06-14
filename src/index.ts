import express from "express";
import rateLimit from "express-rate-limit";
import { ApolloServer } from "apollo-server-express";
import typeDefs from "./graphql/schema";
import resolvers from "./graphql/resolvers/index";
import { PubSub } from "graphql-subscriptions";
import { authMiddleware } from "./middleware/authMiddleware";
import cookieParser from "cookie-parser";
import cors from "cors";

import * as dotenv from "dotenv";
dotenv.config();

const pubsub = new PubSub();
const app = express();

app.get("/test-cookies", (req, res) => {
  console.log("Cookies received:", req.cookies);
  res.send(req.cookies);
});
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

// Apply middleware to all requests
app.use(cookieParser());
app.use(limiter);
app.use(
  cors({
    origin: "http://localhost:4000", // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies) to be sent
  })
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, res }) => {
    console.log(req.cookies, "index");

    const auth = authMiddleware({ req });
    return {
      pubsub,
      cookie: auth,
      res,
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
