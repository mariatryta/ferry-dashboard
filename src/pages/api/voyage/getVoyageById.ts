import type { Unit, Vessel, Voyage } from "@prisma/client";
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";

export type ReturnType = Voyage & { vessel: Vessel } & { units: Unit[] };

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<ReturnType>
) => {
  const id  = req.query.id;
  
  const voyage = await prisma.voyage.findUnique({
    where: {
      id: id as string
    },
    include: {
      vessel: true,
      units: true,
    },
  });

  if (voyage) {
    return res.status(200).json(voyage);
  } else {
    return res.status(404).end();
  }
};

export default handler;
