import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../prisma/prisma-clent";
import bcrypt from "bcryptjs";
import { generateAccessToken } from "../../../../../../lib/jwt";

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
    id: user.id,
    username: user.username,
    roleId: user.roleId,
    squadNumber: user.squadNumber || 0,
  });

  return NextResponse.json({
    user: { ...user, password: undefined },
    token: token,
  });
}
