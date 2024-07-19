// import jwt from "jsonwebtoken";

// if (!process.env.JWT_SECRET) {
//   throw new Error("JWT_SECRET environment variable is missing")
// }
// const secret = process.env.JWT_SECRET;

// interface Payload {
//   id: string;
//   email: string;
// }
// export const signToken = (payload: object): string => {
//   return jwt.sign(payload, secret, { expiresIn: "1h" })
// };

// export const verifyToken = (token: string): object | string => {
//   return jwt.verify(token, secret);
// }

// utils/jwt.ts
import { jwtVerify, SignJWT } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export async function signToken(payload: object) {
  const token = await new SignJWT({ payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('2h')
    .sign(secret);
  return token;
}
