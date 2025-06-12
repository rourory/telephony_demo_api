import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-clent";
import { proceedTypicalDevextremeRequest } from "../../../../../lib/make-devextreme-request";
import { contacts } from "@/generated/prisma";
import { deleteOneById } from "../../../../../lib/delete-one-by-id";
import { createOne } from "../../../../../lib/create-one";

export async function GET(req: NextRequest) {
  return await proceedTypicalDevextremeRequest(prisma.contacts, req);
}

export async function PUT(req: NextRequest) {
  const { id, contactTypeId, relativeId, ...fields } =
    (await req.json()) as contacts;

  const updated = await prisma.contacts.update({
    where: { id: Number(id) },
    data: {
      contactType: { connect: { id: Number(contactTypeId) } },
      relative: { connect: { id: Number(relativeId) } },
      ...fields,
    },
  });

  if (!updated) return NextResponse.json({ status: 400 });

  return NextResponse.json({ data: updated });
}

export async function DELETE(req: NextRequest) {
  return await deleteOneById(req, prisma.contacts, "Contact");
}

export async function POST(req: NextRequest) {
  return await createOne(req, prisma.contacts, "Contact");
}

export const config = {
  api: {
    responseLimit: false,
  },
};
