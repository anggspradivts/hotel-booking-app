import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const recentPropSize = url.searchParams.get('recentPropSize') ?? '2';
  const unverPropSize = url.searchParams.get('unverPropSize') ?? '2';

  const recentSize = parseInt(recentPropSize, 10);
  const unverSize = parseInt(unverPropSize, 10);
  console.log(unverSize)

  if (isNaN(recentSize) || isNaN(unverSize)) {
    return NextResponse.json({ error: 'Invalid page or pageSize' }, { status: 400 });
  }

  try {
    const recentProperties = await db.property.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: recentSize,
    });
    const unverifiedProperties = await db.property.findMany({
      where: {
        confirmed: false
      },
      take: unverSize
    });

    const resData = { recentProperties, unverifiedProperties }

    return NextResponse.json(resData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}