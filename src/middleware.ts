import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PATHS = ["/api/v1/auth"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
    req.method == "OPTIONS"
  ) {
    return NextResponse.next();
  }
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );
    const headers = new Headers(req.headers);
    headers.set("x-user-id", String(payload.sub));
    return NextResponse.next({
      request: { headers },
    });
  } catch {
    return new NextResponse("Unauthorized", { status: 401 });
  }
}

export const config = {
  matcher: ["/src/app/api/:path*", "/api/:path*"],
};
