import { PrismaClient } from "@prisma/client";
import { hashpassword, verifypass } from "./common";
const prisma = new PrismaClient();

const resolver = {
  Query: {
    // employeeFetch(args: employeeInput!): Employee!
    employeeFetch: async (
      _: unknown,
      {
        username,
        employeeID,
      }: {
        username?: string;
        employeeID?: number;
      }
    ) => {
      try {
        if (employeeID) {
          const employee = await prisma.employee.findUnique({
            where: { id: employeeID },
            select: {
              password: false,
            },
            // include: { services: true },
          });
          console.log(employee);

          return employee;
        } else if (username) {
          const employee = await prisma.employee.findUnique({
            where: { username },
          });
          return employee;
        } else throw Error("Bad input.");
      } catch (error: any) {
        console.log(error);
        throw error("Internal error, try again later");
      }
    },
  },
  Mutation: {
    // createEmployee(username: String!, email: String!, password: String!): Employee!
    createEmployee: async (
      _: unknown,
      {
        username,
        email,
        password,
      }: { username: string; email: string; password: string }
    ) => {
      try {
        const hashedpass = await hashpassword(password);
        const employee = await prisma.employee.create({
          data: {
            username,
            email,
            password: hashedpass,
            joinDate: new Date(),
          },
        });
        return employee;
      } catch (error: any) {
        console.log(error);
        throw error(
          "something happened while creating your account, try again later."
        );
      }
    },
    // updateEmployee(username: String!, email: String!, password: String!): Employee!
    updateEmployee: async (
      _: unknown,
      {
        employeeID,
        username,
        email,
        password,
      }: {
        employeeID: number;
        username?: string;
        email?: string;
        password?: string;
      }
    ) => {
      try {
        if (password) {
          password = await hashpassword(password);
        }
        const employee = await prisma.employee.update({
          where: { id: employeeID },
          data: {
            username,
            email,
            password,
          },
        });
        if (!employee) throw Error("User not found.");
        return employee;
      } catch (error: any) {
        console.log(error);
        throw error(
          "something happened while creating your account, try again later."
        );
      }
    },
  },
  Employee: {
    services: async (
      parent: { id: number; services: number[] },
      _: unknown,
      context: { prisma: PrismaClient }
    ) => {
      console.log("Fetching services for employee:", parent.id);

      // Fetch services using the IDs from the employee.services array
      const services = await Promise.all(
        parent.services.map((serviceId) =>
          context.prisma.service.findUnique({ where: { id: serviceId } })
        )
      );

      // Filter out any null results in case some service IDs do not exist
      const validServices = services.filter((service) => service !== null);

      console.log("Services for employee:", validServices);

      return validServices;
    },
  },
};

// type Employee {
//   id: Int!
//   username: String!
//   email: String!
//   password: String!
//   services: [Service!]
//   joinDate: Date
// }
export default resolver;
