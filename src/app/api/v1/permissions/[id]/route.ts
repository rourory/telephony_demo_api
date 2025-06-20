import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../prisma/prisma-clent";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const permission = await prisma.ui_permissions.findUnique({
    where: { id: Number(id) },
  });

  return NextResponse.json(permission);
}
