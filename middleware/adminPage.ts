import { fetchUserServer } from "@/utils/user";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function adminPageMiddleware(req: NextRequest) {
  const reqHeaders = headers();
  const user = await fetchUserServer(reqHeaders);

  if (!user || user.role !== 'ADMIN') {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
  return NextResponse.next();
}