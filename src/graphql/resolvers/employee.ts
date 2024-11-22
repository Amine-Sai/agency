import { PrismaClient } from "@prisma/client";
import { hashpassword, verifypass } from "./common";
const prisma = new PrismaClient();

const resolver = {
  Query: {
    // employeeFetch(args: employeeInput!): Employee!
    employeeFetch: async ({
      username,
      employeeID,
    }: {
      username: string;
      employeeID: number;
    }) => {
      try {
        if (employeeID) {
          const employee = await prisma.employee.findUnique({
            where: { id: employeeID },
          });
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
      username: string,
      email: string,
      password: string
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
      employeeID: number,
      username?: string,
      email?: string,
      password?: string
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
};
export default resolver;
