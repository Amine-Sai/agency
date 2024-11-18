import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { hashpassword, verifypass } from "./common";
import { error } from "console";

const resolver = {
  Query: {
    // createUser(username: String!, email: String!, password: String!): User!
    createUser: async (username: string, email: string, password: string) => {
      try {
        const hashedpass = await hashpassword(password);
        const user = await prisma.user.create({
          data: {
            username,
            email,
            password: hashedpass,
          },
        });
        return user;
      } catch (error:any) {
        throw error ("something happened while creating your account, try again later." );
      }
    },

    //userLogin(email:String!, password: String!): User!
    userLogin: async (email: string, password: string) => {
      try {
        const user = await prisma.user.findUnique({
          where: { email },
          // select: { email: true, id: true, requests: true },
        });
        if (!user) throw error("Invalid credentials.");
        const compare: boolean = await verifypass(password, user?.password);
        if (!compare) throw error("Invalid credentials.");
        return user;
      } catch (error:any) {
        console.log(error);
        throw error(
          "something happened while creating your account, try again later."
        );
      }
    },

    // updateUser(username: String!, email: String!, password: String!): User!
    updateUser: async (
      id: number,
      username?: string,
      email?: string,
      password?: string
    ) => {
      try {
        const user = await prisma.user.update({
          where: { id },
          data: {
            username,
            email,
            password,
          },
        });
        if (!user) throw error("User not found.");
        return user;
      } catch (error:any ) {
        console.log(error);
        throw error(
          "something happened while creating your account, try again later."
        );
      }
    },
  },
};

export default resolver;
