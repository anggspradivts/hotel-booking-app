import { db } from "@/lib/db"
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const getKeyword = url.searchParams.get("keyword");
    let response
    if (getKeyword === "") {
      return
    } else {
      const getProperty = await db.property.findMany({
        where: {
          name: getKeyword && getKeyword.trim() !== "" ? { contains: getKeyword, mode: 'insensitive' } : undefined,
        }
      });
      response = NextResponse.json(getProperty);
      return response
    }
  } catch (error) {
    return;
  }
}