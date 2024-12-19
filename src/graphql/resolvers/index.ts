import { default as employeeResolvers } from "./employee";
import { default as requestResolvers } from "./request";
import { default as serviceResolvers } from "./service";
import { default as userResolvers } from "./user";
import { default as chatResolvers } from "./chat";

const resolvers = {
  Query: {
    ...employeeResolvers.Query,
    ...requestResolvers.Query,
    ...serviceResolvers.Query,
    ...userResolvers.Query,
    ...chatResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...employeeResolvers.Mutation,
    ...requestResolvers.Mutation,
    ...serviceResolvers.Mutation,
    ...chatResolvers.Mutation,
  },
  Employee: employeeResolvers.Employee,
  Request: requestResolvers.Request,
  Chat: chatResolvers.Chat,
  User: userResolvers.User
  // Service: serviceResolvers.Service,
  // User: userResolvers.User,
};

export default resolvers;
