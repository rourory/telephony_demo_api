import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-clent";
import { proceedTypicalDevextremeRequest } from "../../../../../lib/make-devextreme-request";
import { ui_permissions } from "@/generated/prisma";
import { deleteOneById } from "../../../../../lib/delete-one-by-id";
import { createOne } from "../../../../../lib/create-one";

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

export async function DELETE(req: NextRequest) {
  return await deleteOneById(req, prisma.ui_permissions, "Permission");
}

export async function POST(req: NextRequest) {
  return await createOne(req, prisma.ui_permissions, "Permission");
}
