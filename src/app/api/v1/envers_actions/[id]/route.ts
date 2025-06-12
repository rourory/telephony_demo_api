import { NextRequest } from "next/server";
import { prisma } from "../../../../../../prisma/prisma-clent";
import { findOneById } from "../../../../../../lib/find-one-by-id";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return await findOneById(prisma.envers_actions, context);
}
