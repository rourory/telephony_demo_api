import { NextRequest } from "next/server";
import { prisma } from "../../../../../../prisma/prisma-clent";
import { proceedTypicalDevextremeRequest } from "../../../../../../lib/make-devextreme-request";

export async function GET(req: NextRequest) {
  return await proceedTypicalDevextremeRequest(prisma.contacts_aud, req);
}
