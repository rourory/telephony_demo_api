import { prisma } from "../../../../prisma/prisma-clent";
import { NextRequest, NextResponse } from "next/server";

export default async function GET(req: NextRequest) {
  const relationTypes = prisma.relation_types.findMany();

  return NextResponse.json({ data: relationTypes });
}
