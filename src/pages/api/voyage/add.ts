import type {  Voyage } from "@prisma/client";
import type { NextApiHandler, NextApiResponse, NextApiRequest } from "next";
import { prisma } from "~/server/db";


const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<undefined>
) => {
  if (req.method === "POST") {
    const createdVoyage = await prisma.voyage.create({data:JSON.parse(req.body) as Voyage});
    createdVoyage ? res.status(201) : res.status(404);
    res.end();
    return;
  }

  res.status(405).end();
};

export default handler;
