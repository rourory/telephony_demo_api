import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma-clent";

export async function GET(req: NextRequest) {
  const roleId = req.nextUrl.searchParams.get("roleId") || "";

  if (!roleId) {
    return NextResponse.json(
      { messages: ["Role ID is required"] },
      { status: 400 }
    );
  }

  const permissions = await prisma.ui_permissions.findMany({
    where: {
      roleId: Number(roleId),
    },
  });

  return NextResponse.json({ data: permissions });
}
