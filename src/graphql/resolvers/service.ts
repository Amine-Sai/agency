import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const resolver = {
  Query: {
    // serviceFetch(serviceID: Int!): Service
    serviceFetch: async (_: unknown, { id }: { id: number }) => {
      try {
        const service = await prisma.service.findUnique({
          where: {
            id,
          },
        });
        if (!service) {
          throw new Error(`Service not found.`);
        }
        return service;
      } catch (error) {
        console.log(error);
        throw new Error("Internal Error.");
      }
    },
    servicesFetch: async (_: unknown, { title }: { title?: string }) => {
      try {
        const services = await prisma.service.findMany({
          where: title ? { title } : undefined,
        });
        return services;
      } catch (err) {
        console.error("Error fetching services:", err);
        throw new Error("Failed to fetch services.");
      }
    },
  },
  Mutation: {
    createService: async (
      _: unknown,
      {
        title,
        price,
        description,
        team,
      }: { title: string; price: number; description?: string; team?: number[] }
    ) => {
      try {
        // Validate inputs
        if (!title || !price) throw new Error("Title and price are required.");
        if (team && !Array.isArray(team))
          throw new Error("Team must be an array of IDs.");

        // Check for duplicates
        const existingService = await prisma.service.findUnique({
          where: { title },
        });
        if (existingService)
          throw new Error("Service with this title already exists.");

        // Create new service
        const newService = await prisma.service.create({
          data: {
            title,
            price,
            description,
            team: { connect: team?.map((id) => ({ id })) || [] },
          },
        });
        return newService;
      } catch (err) {
        console.error("Error creating service:", err);
        throw new Error("Failed to create service.");
      }
    },

    updateService: async (
      _: unknown,
      {
        id,
        title,
        description,
        team,
      }: { id: number; title?: string; description?: string; team?: number[] }
    ) => {
      try {
        if (!title && !description && !team) {
          throw new Error(
            "No updates provided. Please specify fields to update."
          );
        }

        const updatedService = await prisma.service.update({
          where: { id },
          data: {
            title,
            description,
            team: team ? { connect: team.map((id) => ({ id })) } : undefined,
          },
        });

        return updatedService;
      } catch (err) {
        console.error("Error updating service:", err);
        throw new Error("Failed to update service.");
      }
    },
  },
  Service: {
    team: (parent: { id: number }, _: unknown, context: any) => {
      return context.prisma.service
        .findUnique({ where: { id: parent.id } })
        .team();
    },
  },
};

export default resolver;
