import type { Unit, Vessel, Voyage } from "@prisma/client";
import type { NextApiHandler, NextApiResponse } from "next";
import { prisma } from "~/server/db";

export type ReturnType = (Voyage & { vessel: Vessel } & { units: Unit[] })[];

const handler: NextApiHandler = async (_, res: NextApiResponse<ReturnType>) => {
  const voyages = await prisma.voyage.findMany({
    include: {
      vessel: true,
      units: true,
    },
  });

  res.status(200).json(voyages);
};

export default handler;
