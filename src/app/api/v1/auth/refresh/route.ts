import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../prisma/prisma-clent";
import { generateAccessToken } from "../../../../../../lib/jwt";

export async function POST(req: NextRequest) {
  const { token } = await req.json();
  const jwtToken = token.split(" ")[1];

  try {
    const { payload } = await jwtVerify(
      jwtToken,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );
    const username = payload.username;
    console.log(123, payload);

    if (!username) {
      return NextResponse.json({ messages: ["Unauthorized"] }, { status: 401 });
    }
    const user = await prisma.administration.findFirst({
      where: {
        username: payload.username as string,
      },
    });

    if (!user) {
      return NextResponse.json({ messages: ["Unauthorized"] }, { status: 401 });
    }
    const accessToken = generateAccessToken({
      id: user.id,
      username: user.username,
      roleId: user.roleId,
      squadNumber: user.squadNumber || 0,
    });
    return NextResponse.json({ user: user, token: accessToken });
  } catch (err) {
    return NextResponse.json({ messages: ["Unauthorized"] }, { status: 401 });
  }
}
