import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-clent";
import { proceedTypicalDevextremeRequest } from "../../../../../lib/make-devextreme-request";

export async function GET(req: NextRequest) {
  const convictedId = req.nextUrl.searchParams.get("convictedId") || "";

  if (convictedId === "")
    return await proceedTypicalDevextremeRequest(
      prisma.extra_call_permissions,
      req
    );

  const extraPermissions = await prisma.extra_call_permissions.findMany({
    where: { convictedId: Number(convictedId), commitingDate: null },
  });

  return NextResponse.json({ data: extraPermissions });
}
