import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const deleteOneById = async (
  req: NextRequest,
  client: PrismaClient,
  entityName: string
) => {
  const id = req.nextUrl.searchParams.get("id");

  if (!id)
    return NextResponse.json({ messages: "id is required" }, { status: 400 });

  try {
    await client.delete({ where: { id: Number(id) } });

    const result = await client.findUnique({
      where: { id: Number(id) },
    });

    if (result)
      return NextResponse.json(
        { messages: `${entityName} has not deleted` },
        { status: 400 }
      );
  } catch (e) {
    return NextResponse.json(
      { messages: `${entityName} has not deleted: ${e}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ status: 200 });
};
