import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-clent";

export async function GET(req: NextRequest) {
  const settings = await prisma.settings.findMany();
  return NextResponse.json({ data: settings });
}