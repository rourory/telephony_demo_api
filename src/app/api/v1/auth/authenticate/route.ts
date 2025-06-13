import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../prisma/prisma-clent";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../../../../lib/jwt";

interface Credentials {
  username: string;
  password: string;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Credentials;

  const user = await prisma.administration.findFirst({
    where: {
      username: body.username,
    },
  });

  if (!user || user.username !== body.username) {
    return NextResponse.json(
      { messages: ["Пользователь не найден"] },
      { status: 401 }
    );
  }

  const valid = bcrypt.compareSync(body.password, user.password);

  if (!valid) {
    return NextResponse.json(
      { messages: ["Неверный пароль!"] },
      { status: 401 }
    );
  }

  const token = generateAccessToken({
    id: String(user.id),
    username: Number(user.username),
    roleId: Number(user.roleId),
    squadNumber: Number(user.squadNumber),
  });

  const res = NextResponse.json({
    user: { ...user, password: undefined },
    token: token,
  });

  const refreshToken = generateRefreshToken({
    id: String(user.id),
    username: Number(user.username),
    roleId: Number(user.roleId),
    squadNumber: Number(user.squadNumber),
  });

  res.cookies.set("refresh-token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/api/auth/refresh",
    domain:
      process.env.NODE_ENV === "production"
        ? "https://telephony-demo.vercel.app"
        : "http://localhost:3001",
    maxAge: 15 * 24 * 60 * 60 * 1000,
  });

  return res;
}
