import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-clent";
import { proceedTypicalDevextremeRequest } from "../../../../../lib/make-devextreme-request";
import { relatives } from "@/generated/prisma";
import { deleteOneById } from "../../../../../lib/delete-one-by-id";
import { createOne } from "../../../../../lib/create-one";

export async function GET(req: NextRequest) {
  return await proceedTypicalDevextremeRequest(prisma.relatives, req);
}

export const config = {
  api: {
    responseLimit: false,
  },
};

export async function PUT(req: NextRequest) {
  const { id, relationType, convictedId, ...fields } =
    (await req.json()) as relatives;

  const updated = await prisma.relatives.update({
    where: { id: Number(id) },
    data: {
      convicted: { connect: { id: Number(convictedId) } },
      relation_types: { connect: { id: Number(relationType) } },
      ...fields,
    },
  });

  if (!updated) return NextResponse.json({ status: 400 });

  return NextResponse.json({ data: updated });
}

export async function DELETE(req: NextRequest) {
  return await deleteOneById(req, prisma.relatives, "Relative");
}

export async function POST(req: NextRequest) {
  return await createOne(req, prisma.relatives, "Relative");
}
