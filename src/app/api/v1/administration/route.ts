import { NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-clent";

export async function GET() {
  const administration = prisma.administration.findMany({
    orderBy: { username: "asc" },
  });
  return NextResponse.json(administration);
}
