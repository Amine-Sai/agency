const typeDefs = `

  type User {

    _id: ID!

    username: String!

    email: String!

    password: String!

    requests: [Request!]

    joinDate: Date

  }


  type Service {

    _id: ID!

    title: String!

    team: [Employee!]

    description: String!

  }


  type Employee {

    _id: ID!

    username: String!

    email: String!

    password: String!

    services: [Service!]

    joinDate: Date!

  }


  type Request {

    _id: ID!

    service: Service!

    client: User!

    body: String!

    status: RequestStatus!

    date: Date!

  }


  enum RequestStatus {

    "Pending"

    "Done"

    "Rejected"

  }


  type Query {

    userFetch(_id: ID!): User!

    servicesFetch(_id: ID!): [Service!]

    employeeFetch(_id: ID!): [Employee!]

    requestsFetch(service_id: Number): [Request!]

  }


  type Mutation {

    createUser(username: String!, email: String!, password: String!): User!
    updateUser(username: String!, email: String!, password: String!): User!


    createService(title: String!, team: [Employee!], description: String!, employees: [Employee!]!): Service!

    createEmployee(username: String!, email: String!, password: String!): Employee!
    assignEmployee(username:String!, service: ID!): String

    createRequest(service: Service!, client: User!, status: RequestStatus!): Request!
    updateRequestStatus(service: Service!, client: User!, newStatus: RequestStatus!): Request!

  }
`;

export default typeDefs;
