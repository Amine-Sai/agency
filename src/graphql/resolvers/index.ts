import { default as employeeResolvers } from "./employee";
import { default as requestResolvers } from "./request";
import { default as serviceResolvers } from "./service";
import { default as userResolvers } from "./user";

const resolvers = {
  Query: {
    ...employeeResolvers.Query,
    ...requestResolvers.Query,
    ...serviceResolvers.Query,
    ...userResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...employeeResolvers.Mutation,
    ...requestResolvers.Mutation,
    ...serviceResolvers.Mutation,
  },
  Employee: employeeResolvers.Employee,
  Request: requestResolvers.Request,
  // Service: serviceResolvers.Service,
  // User: userResolvers.User,
};

export default resolvers;
