import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { hashpassword, verifypass } from "./common";

interface UserFetchArgs {
  userID?: number;
  username?: string;
}

const resolver = {
  Query: {
    userFetch: async (_: unknown, { userID, username }: UserFetchArgs) => {
      try {
        if (!userID && !username) {
          throw new Error("You must provide either a userID or a username.");
        }

        const user = userID
          ? await prisma.user.findUnique({ where: { id: userID } })
          : await prisma.user.findUnique({ where: { username } });

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
      }: { username: string; email: string; password: string }
    ) => {
      try {
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
      { email, password }: { email: string; password: string }
    ) => {
      try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await verifypass(password, user.password))) {
          throw new Error("Invalid credentials.");
        }

        return user;
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
      }
    ) => {
      try {
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
