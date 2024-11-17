import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const resolver = {
  Query: {
    fetchRequests: async (service_id: number) => {
      try {
        const requests = await prisma.request.findMany({
          where: {
            serviceId: service_id,
            status: { in: ["pending", "rejected"] },
          },
        });

        return requests;
      } catch (error) {
        throw new Error("Failed to fetch requests.");
      }
    },
  },
  Mutation: {
    // createRequest(service: Service!, client: Client!): Request!
    createRequest: async (service_id: number, user_id: number) => {
      try {
        const existingRequest = await prisma.request.findFirst({
          where: {
            userId: user_id,
            serviceId: service_id,
            status: { in: ["pending", "rejected"] },
          },
        });

        if (!existingRequest) {
          const newRequest = await prisma.request.create({
            data: {
              userId: user_id,
              serviceId: service_id,
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
    updateRequestStatus: async (request_id: number, status: string) => {
      try {
        const update = await prisma.request.update({
          where: {
            id: request_id,
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
};

export default resolver