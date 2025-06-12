import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const createOne = async (
  req: NextRequest,
  client: PrismaClient,
  entityName: string
) => {
  const data = await req.json();

  try {
    const created = await client.create({ data });
    if (created) return NextResponse.json({ data: created });
    else
      return NextResponse.json(
        { messages: `${entityName} not created` },
        { status: 400 }
      );
  } catch (e) {
    return NextResponse.json({ messages: e }, { status: 400 });
  }
};
