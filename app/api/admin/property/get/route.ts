import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const pageSize = url.searchParams.get('pageSize') ?? '2';

  const size = parseInt(pageSize, 10);

  if (isNaN(size)) {
    return NextResponse.json({ error: 'Invalid page or pageSize' }, { status: 400 });
  }

  try {
    const properties = await db.property.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: size,
    });

    return NextResponse.json(properties);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}