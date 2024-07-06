// // middleware/auth.ts
// import { NextFunction, Request, Response } from 'express';
// import { verifyToken } from '../utils/jwt';

// interface DecodedToken {
//   // Add the properties of the decoded token here
//   userId: string;
//   // ...
// }

// export const authMiddleware = (handler: (req: Request, res: Response, next: NextFunction) => void) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     const token = req.headers.authorization?.split(' ')[1];

//     if (!token) {
//       return res.status(401).json({ message: 'Authorization token required' });
//     }

//     try {
//       const decoded: DecodedToken = verifyToken(token);
//       req.user = decoded;
//       return handler(req, res, next);
//     } catch (error) {
//       return res.status(401).json({ message: 'Invalid or expired token' });
//     }
//   };
// };

// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function middleware(req: NextRequest) {
//   const token = req.cookies.get('token');

//   if (token && req.nextUrl.pathname.startsWith('/sign-up')) {
//     return NextResponse.redirect(new URL('/', req.url));
//   }

//   return NextResponse.next();
// }