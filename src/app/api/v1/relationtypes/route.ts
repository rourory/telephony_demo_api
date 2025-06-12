import { proceedTypicalDevextremeRequest } from "../../../../../lib/make-devextreme-request";
import { prisma } from "../../../../../prisma/prisma-clent";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return await proceedTypicalDevextremeRequest(prisma.relation_types, req);
}
