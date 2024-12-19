import { gql } from "apollo-server";

const typeDefs = gql`
  scalar Date

  type User {
    id: Int!
    username: String!
    email: String!
    password: String!
    requests: [Request!]
    joinDate: Date
  }

  type Employee {
    id: Int!
    username: String!
    email: String!
    password: String!
    services: [Service!]
    joinDate: Date
  }

  type Service {
    id: Int!
    title: String!
    price: Float!
    team: [Employee!]
    description: String
  }

  type Request {
    id: Int!
    service: Service
    user: User
    body: String
    status: String!
    date: Date
  }

  type Chat {
    id: Int!
    messages: [Message!]
    request: Request!
    createdAt: Date!
    updatedAt: Date!
  }

  type Message {
    id: Int!
    chat: Chat!
    user: User!
    role: String!
    content: String!
    createdAt: Date!
  }

  ###################

  type Subscription {
    messageSent(chatID: Int!): Message!
  }

  type Query {
    userFetch(userID: Int, username: String): User
    employeeFetch(employeeID: Int, username: String): Employee
    #
    serviceFetch(serviceID: Int!): Service
    servicesFetch(title: String): [Service!]
    #
    requestFetch(requestID: Int!): Request
    requestsFetch(userID: Int): [Request!]
    #
    getChat(requestID: Int!): Chat
    getMessage(messageID: Int!): Message
  }

  type Mutation {
    #employee
    createEmployee(username: String!, email: String! ,password: String!): Employee!
    updateEmployee(employeeID: Int!, username: String ,email: String ,password: String): Employee

    #user
    createUser(username: String!, email: String!, password: String!): User
    updateUser(userID: Int!,username: String,email: String,password: String): User
    userLogin(email: String!, password: String!): Boolean

    # service
    createService(title: String!,price: Float!,team: [Int!],,description: String): Service!

    updateService(serviceID: Int!,title: String,employeeID: [Int!],description: String,price: Float): Service

    # request
    createRequest(serviceID: Int!, userID: Int!, body: String): Request
    updateRequestStatus(requestID: Int!, newStatus: String!): Request
    deleteAllRequests: String

    #chat
    sendMessage(chatID: Int!, userID: Int!, content: String!): Message
  }
`;
export default typeDefs;
