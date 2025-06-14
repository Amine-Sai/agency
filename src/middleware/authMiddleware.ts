import { AuthenticationError } from "apollo-server";
import jwt from "jsonwebtoken";

import * as dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.JWT_TOKEN;



export const authMiddleware = (req: any) => {
  try {
    console.log(req.cookies, "auth");

    if (!req.cookies || !req.cookies.jwt) {
      console.log("im out");

      return null;
    }

    const token = req.cookies.jwt;

    if (!SECRET_KEY) {
      throw new Error("Secret key is not defined.");
    }

    const user = jwt.verify(token, SECRET_KEY);
    if (typeof user == "string") {
      throw new AuthenticationError("Invalid token.");
    }
    return user;
  } catch (err) {
    throw new AuthenticationError("Internal error.");
  }
};

export const cookieVerifier = (cookie: any) => {
  if (!cookie) throw new Error("You must be logged in to proceed");
  return cookie;
};
