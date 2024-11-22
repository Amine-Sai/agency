import { ApolloServer, gql } from "apollo-server";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client
const prisma = new PrismaClient();

// Define your type definitions using gql
const typeDefs = gql`
  type User {
    id: Int!
    username: String!
    email: String!
    password: String!
  }

  type Query {
    userFetch(username: String!): User
  }
`;

// Define your resolvers
const resolvers = {
  Query: {
    userFetch: async (_, { username }) => {
      console.log("Resolver called with username:", username);
      try {
        console.log("working"); // This should print when the resolver is called
        if (username) {
          const user = await prisma.user.findUnique({
            where: { username },
          });
          console.log("User  found:", user); // Log the user found
          return user;
        } else {
          throw new Error("Bad input.");
        }
      } catch (error) {
        console.log("Error occurred:", error); // Log the error
        throw new Error("Internal error, try again later");
      }
    },
  },
};

// Create an instance of ApolloServer
const server = new ApolloServer({ typeDefs, resolvers });

// Start the server
const PORT = 4000;
server.listen(PORT).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
