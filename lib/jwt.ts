import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function getUserIdFromRefreshToken(token: string): string | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

    if (typeof payload === "object" && payload.id) {
      return payload.id;
    }

    return null;
  } catch (err) {
    console.error("Invalid refresh token", err);
    return null;
  }
}

interface RefreshTokenPayload {
  id: number;
  username: string;
  roleId: number;
  squadNumber: number;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as RefreshTokenPayload;
    return payload;
  } catch (err) {
    console.error("Invalid refresh token", err);
    return null;
  }
}

export function generateAccessToken(payload: RefreshTokenPayload): string {
  return (
    "Bearer " +
    jwt.sign(payload, JWT_SECRET, {
      expiresIn: "5d",
    })
  );
}
