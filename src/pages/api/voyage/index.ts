import type { Unit, Vessel, Voyage } from "@prisma/client";
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";

export type VoyageIndexResponsePayload = (Voyage & { vessel: Vessel } & { units: Unit[] })[];

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<VoyageIndexResponsePayload | undefined>
) => {
  if (req.method === "POST") {
    const createdVoyage = await prisma.voyage.create({
      data: JSON.parse(req.body) as Voyage,
    });

    createdVoyage ? res.status(201) : res.status(404);

    res.end();

    return;
  }

  if (req.method === "GET") {
    const voyages = await prisma.voyage.findMany({
      include: {
        vessel: true,
        units: true,
      },
    });

    res.status(200).json(voyages);
  }
};

export default handler;
