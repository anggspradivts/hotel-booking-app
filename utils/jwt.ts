import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is missing")
}
const secret = process.env.JWT_SECRET;

interface Payload {
  id: string;
  email: string;
}
export const signToken = (payload: object): string => {
  return jwt.sign(payload, secret, { expiresIn: "1h" })
};

export const verifyToken = (token: string): object | string => {
  return jwt.verify(token, secret);
}
