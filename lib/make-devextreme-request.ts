import { PrismaClient } from "@prisma/client";
import { parseDevextremeOptions } from "./parse-devextreme-query";
import { NextRequest, NextResponse } from "next/server";

export const proceedTypicalDevextremeRequest = async (
  client: PrismaClient,
  req: NextRequest
) => {
  const { prismaOptions, requireTotalCount } = parseDevextremeOptions(
    req.nextUrl
  );
  const result = await client.findMany(prismaOptions);

  

  let totalCount = 0;
  if (requireTotalCount) {
    totalCount = await client.count({
      ...prismaOptions,
      skip: undefined,
      take: undefined,
    });
  } else {
    totalCount = result.length;
  }

  return NextResponse.json({
    data: result,
    totalCount: totalCount,
    summary: null,
  });
};
