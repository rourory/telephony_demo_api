import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-clent";
import bcrypt from "bcryptjs";
import { use } from "react";

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

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(body.password, salt);
  const valid = bcrypt.compareSync(user.password, hash);

  if (!valid) {
    return NextResponse.json(
      { messages: ["Неверный пароль!"] },
      { status: 401 }
    );
  }

  return NextResponse.json({ data: { user: user, token: "mock" } });
}
