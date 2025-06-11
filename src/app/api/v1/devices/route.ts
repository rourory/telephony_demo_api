import { NextRequest, NextResponse } from "next/server";
import { parseSort } from "../../../../../lib/parse-sort";
import { prisma } from "../../../../../prisma/prisma-clent";

export async function GET(req: NextRequest) {
  const requireTotalCount =
    req.nextUrl.searchParams.get("requireTotalCount") || "";
  const sort = req.nextUrl.searchParams.get("sort") || "";
  const sorting = parseSort(sort);

  const devices = await prisma.devices.findMany({
    orderBy: {
      [sorting.selector]: sorting.desc ? "desc" : "asc",
    },
  });

  if (requireTotalCount === "true")
    return NextResponse.json({ totalCount: devices.length, data: devices });
  return NextResponse.json({ data: devices });
}
