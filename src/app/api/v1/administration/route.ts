import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-clent";
import { proceedTypicalDevextremeRequest } from "../../../../../lib/make-devextreme-request";
import { administration } from "@/generated/prisma";
import { deleteOneById } from "../../../../../lib/delete-one-by-id";
import bcrypt from "bcryptjs";
export async function GET(req: NextRequest) {
  return await proceedTypicalDevextremeRequest(prisma.administration, req);
}

export async function PUT(req: NextRequest) {
  const { id, roleId, ...fields } = (await req.json()) as administration;

  if (!fields.password.startsWith("$"))
    fields.password = bcrypt.hashSync(fields.password, 10);

  const updated = await prisma.administration.update({
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
  return await deleteOneById(req, prisma.administration, "Administration");
}

export async function POST(req: NextRequest) {
  const data = (await req.json()) as administration;
  data.password = bcrypt.hashSync(data.password, 10);
  try {
    const created = await prisma.administration.create({ data });
    if (created) return NextResponse.json({ data: created });
    else
      return NextResponse.json(
        { messages: `Administration is not created` },
        { status: 400 }
      );
  } catch (e) {
    return NextResponse.json({ messages: e }, { status: 400 });
  }
}
