import { PrismaClient } from "@prisma/client";
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
      {
        userID,
      }: {
        userID?: number;
      }
    ) => {
      try {
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
    requestFetch: async (_: unknown, { requestID }: { requestID: number }) => {
      try {
        if (!requestID) throw new Error("Invalid request");
        const request = await prisma.request.findUnique({
          where: {
            id: requestID,
          },
        });
        if (!request) {
          throw new Error("Request not found");
        }
        console.log(request.serviceID);
        const service = await prisma.service.findUnique({
          where: { id: request.serviceID },
        });
        console.log(service);

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
      {
        serviceID,
        userID,
        body,
      }: { serviceID: number; userID: number; body?: string }
    ) => {
      try {
        const existingRequest = await prisma.request.findFirst({
          where: {
            userID: userID,
            serviceID: serviceID,
            // status: "pending",
          },
        });
        console.log("prev", existingRequest);

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
          console.log(newRequest);

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
    updateRequestStatus: async (requestID: number, status: string) => {
      try {
        const update = await prisma.request.update({
          where: {
            id: requestID,
          },
          data: {
            status: status,
          },
        });

        if (!update)
          throw new Error(
            "Request already exists with a pending or rejected status."
          );
      } catch (error) {
        throw new Error(
          "Request already exists with a pending or rejected status."
        );
      }
    },
  },

  Request: {
    service: async (request: any) => {
      try {
        console.log("Request object:", request);
        const service = await prisma.service.findUnique({
          where: {
            id: request.serviceID, // Assuming you have a serviceId field in your Request model
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

    user: async (parent: { userID: number }) => {
      try {
        if (!parent.userID) {
          throw new Error("Service ID is missing in the request");
        }
        const user = await prisma.user.findUnique({
          where: { id: parent.userID },
          select: { password: false },
        });
        return user;
      } catch (error) {
        console.log(error);
        throw new Error("Invalid request");
      }
    },
  },
};
export default resolver;
