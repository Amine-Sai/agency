import { AuthenticationError } from "apollo-server";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.JWT_TOKEN;

export const authMiddleware = (context: any) => {
  try {
    const token = context.req.headers.token;

    if (!token) {
      throw new AuthenticationError("You must be logged in.");
    }

    const userID = jwt.verify(token, SECRET_KEY);
    return { userID };
  } catch (err) {
    throw new AuthenticationError("Invalid token.");
  }
};
