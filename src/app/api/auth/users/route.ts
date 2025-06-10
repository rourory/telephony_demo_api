import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-clent";

// const allowedOrigins: [
//   "http://localhost:3000",
//   "https://rourory.github.io",
//   "https://telephony-demo-api.vercel.app"
// ];

export async function GET(req: NextRequest) {
  if (req.method === "OPTIONS") {
    return NextResponse.json("OK");
  }

  const archived = req.nextUrl.searchParams.get("archived") || "";

  const users = await prisma.administration.findMany({
    where: {
      archived: archived === "true",
    },
  });

  const res = NextResponse.json(users);

  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  return NextResponse.json(users);
}
