import { fetchUserServer } from "@/utils/user";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function adminRoutesApiMiddleware(req: NextRequest) {
  const reqHeaders = headers();
  const user = await fetchUserServer(reqHeaders);
  if (!user || user.role !== "ADMIN") {
    return NextResponse.redirect(new URL('/unauthorized', req.url))
  }
  return NextResponse.next();
}