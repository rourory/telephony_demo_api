import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-clent";
import { parseDevextremeOptions } from "../../../../../lib/parse-devextreme-query";

export async function GET(req: NextRequest) {
  const { prismaOptions, requireTotalCount } = parseDevextremeOptions(
    req.nextUrl
  );
  const convicted = await prisma.convicted.findMany(prismaOptions);

  let totalCount = 0;
  if (requireTotalCount) {
    totalCount = await prisma.convicted.count({
      ...prismaOptions,
      skip: undefined,
      take: undefined,
    });
  } else {
    totalCount = convicted.length;
  }

  return NextResponse.json({
    data: convicted,
    totalCount: totalCount,
    summary: null,
  });
}
