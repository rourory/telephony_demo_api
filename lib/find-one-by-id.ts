import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export const findOneById = async (
  client: PrismaClient,
  context: { params: Promise<{ id: string }> }
) => {
  const { id } = await context.params;

  const result = await client.findUnique({
    where: { id: Number(id) },
  });

  return NextResponse.json(result);
};
