import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is missing")
}
const secret = process.env.JWT_SECRET;

interface Payload {
  id: string;
  email: string;
}
export const signToken = (payload: Payload) => {
  return jwt.sign(payload, secret, { expiresIn: "1h" })
};

interface Token {
  id: string;
  email: string;
}
export const verifyToken = (token: Token) => {
  return jwt.verify(token, secret);
}