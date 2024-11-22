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
      _: any,
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
        throw new Error("Failed to fetch requests.");
      }
    },

    // requestFetch(requestID: Int!): [Request!]
    requestFetch: async ({ requestID }: { requestID: number }) => {
      try {
        const requests = await prisma.request.findMany({
          where: {
            id: requestID,
          },
        });

        return requests;
      } catch (error) {
        throw new Error("Failed to fetch requests.");
      }
    },
  },
  Mutation: {
    // createRequest(serviceID: Int!, userID: Int!): Request!
    createRequest: async (serviceID: number, userID: number) => {
      try {
        const existingRequest = await prisma.request.findFirst({
          where: {
            userID: userID,
            serviceID: serviceID,
            status: { in: ["pending", "rejected"] },
          },
        });

        if (!existingRequest) {
          const newRequest = await prisma.request.create({
            data: {
              userID: userID,
              serviceID: serviceID,
              status: "pending",
            },
          });
          return newRequest;
        } else {
          throw new Error(
            "Request already exists with a pending or rejected status."
          );
        }
      } catch (error) {
        throw new Error(
          "Request already exists with a pending or rejected status."
        );
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

    // deleteRequest(request_id: Int!)
    //   refundRequest: async (id: number) => {
    //     try {
    //       const request = await prisma.request.findUnique({
    //         where: { id },
    //       });
    //       if (request && request.status == "pending" ) {
    //       const deletedRequest = await prisma.request.delete({
    //           where: { id },
    //         });
    //       if (!deletedRequest)
    //         throw new Error(
    //           "Request already exists with a pending or rejected status."
    //         );
    //       return deletedRequest
    //       // insert refund logic here
    //     } catch (error) {
    //       throw new Error(
    //         "Request already exists with a pending or rejected status."
    //       );
    //     }
    //   },
  },
};

export default resolver;
