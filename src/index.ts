// import { gql } from "apollo-server";

// const typeDefs = gql`
//   scalar Date

//   type User {
//     id: Int!
//     username: String!
//     email: String!
//     password: String!
//     requests: [Request!]
//     joinDate: Date
//   }

//   type Service {
//     id: Int!
//     title: String!
//     price: Float!
//     team: [Employee!]
//     description: String!
//   }

//   type Employee {
//     id: Int!
//     username: String!
//     email: String!
//     password: String!
//     services: [Service!]
//     joinDate: Date
//   }

//   type Request {
//     id: Int!
//     service: Service!
//     user: User!
//     body: String!
//     status: String!
//     date: String
//   }

//   type Query {
//     userFetch(args: userInput!): User
//     employeeFetch(args: employeeInput!): Employee
//     #
//     serviceFetch(serviceID: Int!): Service
//     servicesFetch(args: serviceInput!): [Service!]
//     #
//     requestFetch(requestID: Int!): [Request!]
//     requestsFetch(title: String!): [Request!]
//   }

//   input employeeInput {
//     employeeID: Int
//     username: String
//   }
//   input userInput {
//     userID: Int
//     username: String
//   }
//   input serviceInput {
//     serviceID: Int
//     title: String
//   }
//   input requestInput {
//     serviceID: Int!
//     userID: Int!
//   }

//   type Mutation {
//     createEmployee(
//       username: String!
//       email: String!
//       password: String!
//     ): Employee
//     updateEmployee(
//       employeeID: Int!
//       username: String
//       email: String
//       password: String
//     ): Employee

//     createUser(username: String!, email: String!, password: String!): User
//     updateUser(username: String!, email: String!, password: String!): User
//     userLogin(email: String!, password: String!): User!

//     createService(
//       title: String
//       employeeID: [Int!]
//       description: String
//       price: Float
//     ): Service
//     updateService(
//       title: String
//       employeeID: [Int!]
//       description: String
//       price: Float
//     ): Service

//     createRequest(serviceID: Int!, userID: Int!): Request
//     updateRequestStatus(requestID: Int!, newStatus: String!): Request
//   }
// `;

import { ApolloServer } from "apollo-server";
import typeDefs from "./graphql/schema";
import resolvers from "./graphql/resolvers/index";

const server = new ApolloServer({ typeDefs, resolvers });

const PORT = 4000;
server.listen(PORT).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
