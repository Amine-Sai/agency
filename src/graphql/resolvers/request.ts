import { PrismaClient } from "@prisma/client";
import { cookieVerifier } from "../../middleware/authMiddleware";
const prisma = new PrismaClient();

/* 
input requestInput {
  serviceID : Int!
  userID: Int!
} */

const resolver = {
  Query: {
    // requestsFetch(args: requestInput!): [Request!]
    requestsFetch: async (
      _: unknown,

      __: unknown,
      { cookie }: { cookie: any }
    ) => {
      try {
        const { userID } = cookieVerifier(cookie);
        const requests = await prisma.request.findMany({
          where: {
            userID,
            // status: { in: ["pending", "rejected"] },
          },
        });

        return requests;
      } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch requests.");
      }
    },

    // requestFetch(requestID: Int!): Request
    requestFetch: async (
      _: unknown,
      { requestID }: { requestID: number },
      { cookie }: { cookie: any }
    ) => {
      try {
        const { userID } = cookieVerifier(cookie);
        if (!requestID) throw new Error("Invalid request");
        const request = await prisma.request.findUnique({
          where: {
            id: requestID,
          },
        });
        if (!request) {
          throw new Error("Request not found");
        }
        if (request.userID != userID) throw new Error("Unauthorized");
        return request;
      } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch requests.");
      }
    },
  },

  Mutation: {
    // createRequest(serviceID: Int!, userID: Int!): Request!
    createRequest: async (
      _: unknown,
      { serviceID, body }: { serviceID: number; body?: string },
      { cookie }: { cookie: any }
    ) => {
      try {
        const { userID } = cookieVerifier(cookie);
        if (!serviceID || !userID) throw new Error("Invalid params");
        const existingRequest = await prisma.request.findFirst({
          where: {
            userID: userID,
            serviceID: serviceID,
            // status: "pending",
          },
        });

        if (!existingRequest) {
          const newRequest = await prisma.request.create({
            data: {
              userID,
              serviceID,
              status: "pending",
              body,
              date: new Date(),
            },
          });
          if (!newRequest) throw new Error("Error occured, please try again.");
          const newChat = await prisma.chat.create({
            data: {
              requestID: newRequest.id,
            },
          });
          if (!newChat)
            throw new Error(
              "Error while creating chat, contact our email in cases of any issues"
            );
          return newRequest;
        } else {
          throw new Error(
            "Request already exists with a pending or rejected status."
          );
        }
      } catch (error) {
        throw new Error("Unable to fetch request.");
      }
    },

    // updateRequest(service: Service!, client: Client!, status: RequestStatus!): Request!
    updateRequestStatus: async (
      _: unknown,
      { requestID, newStatus }: { requestID: number; newStatus: string }
    ) => {
      try {
        if (!requestID || !newStatus) throw new Error("Invalid input");
        let update = await prisma.request.update({
          where: {
            id: requestID,
          },
          data: {
            status: newStatus,
          },
        });

        if (!update)
          throw new Error(
            "Request already exists with a pending or rejected status."
          );
        console.log(update);

        return update;
      } catch (error) {
        throw new Error("Internal error.");
      }
    },
  },

  Request: {
    service: async (request: any) => {
      try {
        console.log(request);

        if (!request) throw new Error("Error occured");
        const service = await prisma.service.findUnique({
          where: {
            id: request.serviceID,
          },
        });
        if (!service) {
          throw new Error("Service not found");
        }
        return service;
      } catch (error) {
        console.error("Error fetching service:", error);
        throw new Error("Failed to fetch service.");
      }
    },

    user: async (parent: any) => {
      try {
        if (!parent || !parent.userID) {
          throw new Error("Error occured");
        }
        const user = await prisma.user.findUnique({
          where: { id: parent.userID },
        });

        return user;
      } catch (error) {
        console.log(error);
        throw new Error("Invalid request");
      }
    },
  },
    chat: async (parent: any) =>{
      try {
          if (!parent || !parent.id) throw new Error('Invalid request.')
          const chat = await prisma.chat.findUnique({where: {id: parent.}})
      } catch (error) {
        throw new Error('Internal error')
      }
    }
};
export default resolver;
