import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-clent";
import bcrypt from "bcryptjs";

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
    return NextResponse.json({ messages: ["User not found"] }, { status: 401 });
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(body.password, salt);

  if (user.password !== hash) {
    return NextResponse.json(
      { messages: ["Password incorrect"] },
      { status: 401 }
    );
  }

  return NextResponse.json({ data: { user: user, token: "mock" } });
}
