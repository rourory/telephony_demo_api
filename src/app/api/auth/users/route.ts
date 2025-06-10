import { prisma } from "../../../../../prisma/prisma-clent";
import initMiddleware from "../../../../../lib/init-middleware";
import Cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";

// const allowedOrigins: [
//   "http://localhost:3000",
//   "https://rourory.github.io",
//   "https://telephony-demo-api.vercel.app"
// ];

const cors = initMiddleware(
  Cors({
    methods: ["GET", "POST", "OPTIONS"],
    origin: "http://localhost:3000",
  })
);

export async function GET(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  cors(req, res);

  const archived = req.body.nextUrl.searchParams.get("archived") || "";

  const users = await prisma.administration.findMany({
    where: {
      archived: archived === "true",
    },
  });

  res.json({ message: JSON.stringify(users) });

  return res;
}
