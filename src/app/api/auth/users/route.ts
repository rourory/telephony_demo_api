import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-clent";

// const allowedOrigins: [
//   "http://localhost:3000",
//   "https://rourory.github.io",
//   "https://telephony-demo-api.vercel.app"
// ];

export async function GET(req: NextRequest) {
  const archived = req.nextUrl.searchParams.get("archived") || "";

  const users = await prisma.administration.findMany({
    where: {
      archived: archived === "true",
    },
  });

  return NextResponse.json({ data: users });
}
