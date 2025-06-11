import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-clent";

export async function GET(req: NextRequest) {
  const contactTypes = await prisma.contact_types.findMany();
  return NextResponse.json({ data: contactTypes });
}
