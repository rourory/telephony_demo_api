// src/app/api/refresh/route.ts

import { NextRequest, NextResponse } from "next/server";

import {
  generateAccessToken,
  getUserIdFromRefreshToken,
  verifyRefreshToken,
} from "../../../../../../lib/jwt";
import { prisma } from "../../../../../../prisma/prisma-clent";

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get("refresh-token");

  if(!refreshToken) {
    return NextResponse.json(
      { messages: ["Invalid refresh token"] },
      { status: 401 }
    );
  }

  if (!refreshToken || !verifyRefreshToken(refreshToken.value)) {
    return NextResponse.json(
      { messages: ["Invalid refresh token"] },
      { status: 401 }
    );
  }

  const userId = getUserIdFromRefreshToken(refreshToken.value);

  if (!userId) {
    return NextResponse.json(
      { messages: ["Invalid refresh token"] },
      { status: 401 }
    );
  }

  const user = await prisma.administration.findFirst({
    where: {
      id: Number(userId),
    },
  });

  const newAccessToken = generateAccessToken({
    id: String(user?.id),
    username: Number(user?.username),
    roleId: Number(user?.roleId),
    squadNumber: Number(user?.squadNumber),
  });
  console.log("REFRESHED TOKEN", newAccessToken);
  return NextResponse.json({ token: newAccessToken });
}
