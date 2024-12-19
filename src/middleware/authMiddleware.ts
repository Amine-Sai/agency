import { AuthenticationError } from "apollo-server";
import jwt from "jsonwebtoken";

import * as dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.JWT_TOKEN;

export const authMiddleware = (req: any) => {
  try {
    const token = req.headers.token;

    if (!token) {
      throw new AuthenticationError("You must be logged in.");
    }
    if (!SECRET_KEY) {
      throw new Error("Secret key is not defined.");
    }

    const user = jwt.verify(token, SECRET_KEY);
    return user;
  } catch (err) {
    throw new AuthenticationError("Invalid token.");
  }
};
