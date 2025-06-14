import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import * as jwt from "jsonwebtoken";

import { hashpassword, verifypass } from "./common";
import { cookieVerifier } from "../../middleware/authMiddleware";
import * as dotenv from "dotenv";
dotenv.config();

const resolver = {
  Query: {
    userFetch: async (_: unknown, __: unknown, { cookie }: { cookie: any }) => {
      try {
        const { userID } = cookieVerifier(cookie);

        const user = await prisma.user.findUnique({
          where: { id: userID },
        });
        if (!user) {
          throw new Error("User not found.");
        }

        return user;
      } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("Failed to fetch user. Please try again later.");
      }
    },
  },
  Mutation: {
    // createUser(username: String!, email: String!, password: String!): User!
    createUser: async (
      _: unknown,
      {
        username,
        email,
        password,
      }: { username: string; email: string; password: string },
      { req }: { req: any }
    ) => {
      try {
        if (req.headers.jwt)
          throw new Error("You're already logged in, log out to proceed.");

        if (!username || !email || !password) {
          throw new Error(
            "All fields (username, email, and password) are required."
          );
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
          throw new Error("A user with this email already exists.");
        }

        const hashedPass = await hashpassword(password);

        const user = await prisma.user.create({
          data: {
            username,
            email,
            password: hashedPass,
            joinDate: new Date(),
          },
        });

        return user;
      } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create user. Please try again later.");
      }
    },

    //userLogin(email:String!, password: String!): User!
    userLogin: async (
      _: unknown,
      { email, password }: { email: string; password: string },
      { res }: { res: any }
    ) => {
      try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await verifypass(password, user.password))) {
          throw new Error("Invalid credentials.");
        }
        const SECRET_KEY = process.env.JWT_TOKEN;
        if (!SECRET_KEY) {
          throw new Error("Secret key is not defined.");
        }
        const token = jwt.sign(
          { userID: user.id, role: user.role },
          SECRET_KEY
        );
        res.cookie("jwt", token, {
          httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
          secure: false, // Set to true if using HTTPS
          sameSite: "None", // Adjust based on your needs
        });

        return true;
      } catch (error) {
        console.error("Error during login:", error);
        throw new Error("Login failed. Please try again later.");
      }
    },

    // updateUser(username: String!, email: String!, password: String!): User!
    updateUser: async (
      _: unknown,
      {
        userID,
        username,
        email,
        password,
      }: {
        userID: number;
        username?: string;
        email?: string;
        password?: string;
      },
      { user }: { user: any }
    ) => {
      try {
        cookieVerifier(user);
        if (user.userID != userID) throw new Error("Unauthorized");

        if (!username && !email && !password) {
          throw new Error("No updates provided.");
        }

        const data: { username?: string; email?: string; password?: string } = {
          username,
          email,
          password,
        };

        if (password) {
          data.password = await hashpassword(password);
        }

        const updatedUser = await prisma.user.update({
          where: { id: userID },
          data,
        });

        if (!updatedUser) {
          throw new Error("User not found.");
        }

        return updatedUser;
      } catch (error) {
        console.error("Error updating user:", error);
        throw new Error("Failed to update user. Please try again later.");
      }
    },
  },
  User: {
    requests: async (parent: any, _: unknown, context: any) => {
      try {
        if (!parent) throw new Error("Error occured.");
        const requests = await context.prisma.request.findMany({
          where: {
            userID: parent.id,
          },
        });
        return requests;
      } catch (error) {
        console.error("Error fetching requests:", error);
        throw new Error("Failed to fetch requests.");
      }
    },
  },
};

export default resolver;
