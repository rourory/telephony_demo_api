import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-clent";
import { proceedTypicalDevextremeRequest } from "../../../../../lib/make-devextreme-request";
import { convicted } from "@/generated/prisma";
import { deleteOneById } from "../../../../../lib/delete-one-by-id";
import { createOne } from "../../../../../lib/create-one";

export async function GET(req: NextRequest) {
  return await proceedTypicalDevextremeRequest(prisma.convicted, req);
}

export async function PUT(req: NextRequest) {
  const { id, ...fields } = (await req.json()) as convicted;

  const updated = await prisma.convicted.update({
    where: { id: Number(id) },
    data: {
      ...fields,
    },
  });

  if (!updated) return NextResponse.json({ status: 400 });

  return NextResponse.json({ data: updated });
}

export async function DELETE(req: NextRequest) {
  return await deleteOneById(req, prisma.convicted, "Convicted");
}

export async function POST(req: NextRequest) {
  return await createOne(req, prisma.convicted, "Convicted");
}
