import { db } from "@/lib/db";
import { fetchUserServer } from "@/utils/user";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = url.searchParams.get('page') ?? '1';
  const pageSize = url.searchParams.get('pageSize') ?? '5';

  const pageNumber = parseInt(page, 10);
  const size = parseInt(pageSize, 10);

  if (isNaN(pageNumber) || isNaN(size)) {
    return NextResponse.json({ error: 'Invalid page or pageSize' }, { status: 400 });
  }

  try {
    const properties = await db.property.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      skip: (pageNumber - 1) * size,
      take: size,
    });

    return NextResponse.json(properties);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}