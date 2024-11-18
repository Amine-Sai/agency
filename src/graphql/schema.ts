const typeDefs = `
scalar Date

  type User {

    _id: Int!

    username: String!

    email: String!

    password: String!

    requests: [Request!]

    joinDate: Date

  }


  type Service {

    _id: Int!

    title: String!

    team: [Employee!]

    description: String!

  }


  type Employee {

    _id: Int!

    username: String!

    email: String!

    password: String!

    services: [Service!]

    joinDate: Date!

  }


  type Request {

    _id: Int!

    service: Service!

    client: User!

    body: String!

    status: String!

    date: Date!

  }


  type Query {

    userFetch(_id: Int!): User!

    servicesFetch(_id: Int!): [Service!]

    employeeFetch(_id: Int!): [Employee!]

    requestsFetch(service_id: Int!): [Request!]

  }


  type Mutation {

    createUser(username: String!, email: String!, password: String!): User!
    updateUser(username: String!, email: String!, password: String!): User!


    createService(title: String!, team: [Employee!], description: String!, employees: [Employee!]!): Service!

    createEmployee(username: String!, email: String!, password: String!): Employee!
    assignEmployee(username:String!, service: Int!): String

    createRequest(service: Service!, client: User!, status: String!): Request!
    updateRequestStatus(service: Service!, client: User!, newStatus: String!): Request!

  }
`;
export default typeDefs;
