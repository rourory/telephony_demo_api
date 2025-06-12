import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-clent";
import { proceedTypicalDevextremeRequest } from "../../../../../lib/make-devextreme-request";
import { ui_permissions } from "@/generated/prisma";

export async function GET(req: NextRequest) {
  return await proceedTypicalDevextremeRequest(prisma.ui_permissions, req);
}

export async function PUT(req: NextRequest) {
  const { id, roleId, ...fields } = (await req.json()) as ui_permissions;

  const updated = await prisma.ui_permissions.update({
    where: { id: Number(id) },
    data: {
      role: { connect: { id: Number(roleId) } },
      ...fields,
    },
  });

  if (!updated) return NextResponse.json({ status: 400 });

  return NextResponse.json({ data: updated });
}
