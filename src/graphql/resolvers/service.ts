import { PrismaClient } from "@prisma/client";
import { error } from "console";
const prisma = new PrismaClient();

const resolver = {
  Query: {
    fetchServices: async (service_id: number) => {
      try {
        const requests = await prisma.service.findUnique({
          where: {
            id: service_id,
          },
        });

        return requests;
      } catch (error) {
        throw new Error("Failed to fetch requests.");
      }
    },
  },
  Mutation: {
    // createService(title: String!, name: String!, team: [Employee!], description: String!, employees: [Employee!]!): Service!
    createService: async (
      title: string,
      description?: string,
      employees_id?: number[]
    ) => {
      try {
        const existingService = await prisma.service.findFirst({
          where: {
            title: title,
          },
        });

        //manual data integerity check, apparently it's unnecessary

        //     const employeeConnections = employees
        //   ? await Promise.all(
        //       employees.map(async (id) => {
        //         const employee = await prisma.employee.findUnique({
        //           where: { id },
        //         });
        //         if (!employee) {
        //           throw new Error(`Employee with ID ${id} not found.`);
        //         }
        //         return { id };
        //       })
        //     )
        //   : [];

        const newService = await prisma.service.create({
          data: {
            title,
            description,
            team: {
              connect: employees_id ? employees_id.map((id) => ({ id })) : [],
            },
          },
        });
        return newService;
      } catch (error) {
        throw new Error(
          "Service already exists with a pending or rejected status."
        );
      }
    },

    // updateService(service: Service!, client: Client!, status: ServiceStatus!): Service!
    updateService: async (
      service_id: number,
      updates?: {
        title?: string;
        description?: string;
        employees_id?: number[];
      }
    ) => {
      try {
        if (!updates)
          throw error("No updates provided, please make some changes-");
        const update = await prisma.service.update({
          where: {
            id: service_id,
          },
          data: {
            ...(updates.title !== undefined && { title: updates.title }),

            ...(updates.description !== undefined && {
              description: updates.description,
            }),

            ...(updates.employees_id && {
              team: {
                connect: updates.employees_id.map((id) => ({ id })),
              },
            }),
          },
        });

        if (!update)
          throw new Error(
            "Service already exists with a pending or rejected status."
          );
      } catch (error) {
        throw new Error(
          "Service already exists with a pending or rejected status."
        );
      }
    },
  },
};

export default resolver