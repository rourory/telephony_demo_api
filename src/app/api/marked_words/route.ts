import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma-clent";

export async function GET(req: NextRequest) {
  const markedWords = await prisma.marked_words.findMany();
  return NextResponse.json({ data: markedWords });
}
